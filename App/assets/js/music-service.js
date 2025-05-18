'use strict';
export default class MusicService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async readInfoAsync() {
    // Sends a request to fetch information about music groups from the API.
    const res = await fetch(
      `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=true&pageNr=0&pageSize=1`
    );
    if (!res.ok) throw new Error("Kunde inte hämta info");
    const data = await res.json();
    return {
      db: {
        nrSeededMusicGroups: data.dbItemsCount, // Stores the number of seeded music groups.
        nrUnseededMusicGroups: 0, // Placeholder for unseeded music groups.
        nrSeededAlbums: 0, // Placeholder for seeded albums
        nrUnseededAlbums: 0, // Placeholder for unseeded albums
        nrSeededArtists: 0, // Placeholder for seeded artists
        nrUnseededArtists: 0, // Placeholder for unseeded artists
      },
    };
  }

  // Music groups
  async getMusicGroups(pageNr = 0, pageSize = 30) {
    const res = await fetch(
      `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=true&pageNr=${pageNr}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta musikgrupper");
    return await res.json();
  }
  async getMusicGroupById(id) {
    console.log("Försöker hämta musikgrupp med ID:", id);
    const res = await fetch(`${this.baseUrl}/MusicGroup/ReadOne?id=${id}`);
    if (!res.ok) throw new Error("Kunde inte hämta musikgrupp");
    return await res.json();
  }

  // Albums
  async getAlbums(pageNr = 0, pageSize = 30) {
    const res = await fetch(
      `${this.baseUrl}/Album/Read?seeded=true&flat=true&pageNr=${pageNr}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta album");
    return await res.json();
  }
  async getAlbumById(id) {
    const res = await fetch(`${this.baseUrl}/Album/ReadOne?id=${id}`);
    if (!res.ok) throw new Error("Kunde inte hämta album");
    return await res.json();
  }

  // Artists
  async getArtists(pageNr = 0, pageSize = 30) {
    const res = await fetch(
      `${this.baseUrl}/Artist/Read?seeded=true&flat=true&pageNr=${pageNr}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta artister");
    return await res.json();
  }
  async getArtistById(id) {
    const res = await fetch(`${this.baseUrl}/Artist/ReadOne?id=${id}`);
    if (!res.ok) throw new Error("Kunde inte hämta artist");
    return await res.json();
  }
}
