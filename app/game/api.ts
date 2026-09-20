import { shuffle } from "./logic";
import type { Character, LoadErrorKind } from "./types";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://dragonball-api.com/api"
).replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 10_000;
const IMAGE_TIMEOUT_MS = 10_000;
const CHARACTER_LIMIT = 100;

export class LoadError extends Error {
  readonly kind: LoadErrorKind;

  constructor(kind: LoadErrorKind) {
    super(`Failed to load game: ${kind}`);
    this.name = "LoadError";
    this.kind = kind;
  }
}

export function toLoadError(error: unknown): LoadErrorKind {
  return error instanceof LoadError ? error.kind : "network";
}

async function requestCharacters(): Promise<Character[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/characters?limit=${CHARACTER_LIMIT}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new LoadError(
      error instanceof DOMException && error.name === "TimeoutError" ? "timeout" : "network",
    );
  }

  if (response.status === 429) throw new LoadError("rateLimit");
  if (!response.ok) throw new LoadError("server");

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new LoadError("server");
  }

  const characters = parseCharacters(data);
  if (characters.length === 0) throw new LoadError("empty");
  return characters;
}

function parseCharacters(data: unknown): Character[] {
  const items = (data as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) return [];

  const seenIds = new Set<number>();
  const seenImages = new Set<string>();
  const characters: Character[] = [];

  for (const item of items) {
    const { id, name, image } = (item ?? {}) as Record<string, unknown>;
    if (typeof id !== "number" || typeof name !== "string" || typeof image !== "string") continue;

    let url: URL;
    try {
      url = new URL(image);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    if (seenIds.has(id) || seenImages.has(url.href) || !name.trim()) continue;

    seenIds.add(id);
    seenImages.add(url.href);
    characters.push({ id, name: name.trim(), image: url.href });
  }
  return characters;
}

let charactersRequest: Promise<Character[]> | null = null;

function fetchCharacters(): Promise<Character[]> {
  charactersRequest ??= requestCharacters().catch((error) => {
    charactersRequest = null;
    throw error;
  });
  return charactersRequest;
}

const imageLoads = new Map<string, Promise<boolean>>();

function preloadImage(url: string): Promise<boolean> {
  let load = imageLoads.get(url);
  if (!load) {
    load = new Promise<boolean>((resolve) => {
      const image = new Image();
      const timer = setTimeout(() => resolve(false), IMAGE_TIMEOUT_MS);
      const settle = (ok: boolean) => {
        clearTimeout(timer);
        resolve(ok);
      };
      image.onload = () => {
        image.decode().then(
          () => settle(true),
          () => settle(true),
        );
      };
      image.onerror = () => settle(false);
      image.src = url;
    });
    imageLoads.set(url, load);
    void load.then((ok) => {
      if (!ok) imageLoads.delete(url);
    });
  }
  return load;
}

export async function loadPlayableCharacters(count: number): Promise<Character[]> {
  const candidates = shuffle(await fetchCharacters());
  const playable: Character[] = [];
  let next = 0;

  while (playable.length < count && next < candidates.length) {
    const batch = candidates.slice(next, next + count - playable.length);
    next += batch.length;
    const results = await Promise.all(batch.map((c) => preloadImage(c.image)));
    batch.forEach((character, i) => {
      if (results[i]) playable.push(character);
    });
  }

  if (playable.length < count) throw new LoadError("images");
  return playable;
}
