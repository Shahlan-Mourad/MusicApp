'use strict';
export default class MusicService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultPageSize = 30;
    this.maxPageSize = 1000;
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
  async getMusicGroups(pageNr = 0, pageSize = this.defaultPageSize) {
    const res = await fetch(
      `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=true&pageNr=${pageNr}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Kunde inte hämta musikgrupper");
    return await res.json();
  }
  async getMusicGroupById(id) {
    try {
      console.log("Försöker hämta musikgrupp med ID:", id);
      
      // First get total count to know how many pages to check
      const countRes = await fetch(
        `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=true&pageNr=0&pageSize=1`
      );
      
      if (!countRes.ok) {
        throw new Error("Kunde inte hämta antal musikgrupper");
      }
      
      const countData = await countRes.json();
      const totalCount = countData.dbItemsCount;
      const pageSize = this.maxPageSize;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      console.log(`Söker bland ${totalCount} musikgrupper på ${totalPages} sidor...`);
      
      // Try each page until we find the music group
      for (let page = 0; page < totalPages; page++) {
        console.log(`Kontrollerar sida ${page + 1} av ${totalPages}...`);
        
        const musicGroupRes = await fetch(
          `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=false&pageNr=${page}&pageSize=${pageSize}`
        );
        
        if (!musicGroupRes.ok) {
          throw new Error("Kunde inte hämta musikgrupper");
        }
        
        const musicGroupData = await musicGroupRes.json();
        const band = musicGroupData.pageItems.find(group => String(group.musicGroupId) === String(id));
        
        if (band) {
          console.log("Hittad musikgrupp:", band.name);
          console.log("Antal artister:", band.artists ? band.artists.length : 0);
          console.log("Antal album:", band.albums ? band.albums.length : 0);
          return band;
        }
      }
      
      throw new Error(`Ingen musikgrupp hittades med ID: ${id}`);
    } catch (error) {
      console.error("Fel vid hämtning av musikgrupp:", error);
      throw error;
    }
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
