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
      console.log("Försöker hämta musikgrupp med ID:", id, "Typ:", typeof id);
      
      // Fetch music group with related data
      const musicGroupRes = await fetch(
        `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=false&pageNr=0&pageSize=${this.maxPageSize}`
      );
      
      if (!musicGroupRes.ok) {
        throw new Error(`Kunde inte hämta musikgrupper: ${musicGroupRes.status}`);
      }
      
      const musicGroupData = await musicGroupRes.json();
      console.log("Alla tillgängliga musikgrupper:", musicGroupData.pageItems);
      
      // Find the music group with matching ID
      const band = musicGroupData.pageItems.find(group => {
        console.log("Jämför:", {
          searchId: id,
          searchIdType: typeof id,
          groupId: group.musicGroupId,
          groupIdType: typeof group.musicGroupId,
          groupName: group.name
        });
        return String(group.musicGroupId) === String(id);
      });
      
      if (!band) {
        console.log("Tillgängliga musicGroupId:n:", musicGroupData.pageItems.map(group => ({
          id: group.musicGroupId,
          idType: typeof group.musicGroupId,
          name: group.name
        })));
        throw new Error(`Ingen musikgrupp hittades med ID: ${id}`);
      }
      
      console.log("Hittad musikgrupp:", band);

      // Fetch artists for this music group
      const artistsRes = await fetch(
        `${this.baseUrl}/Artist/Read?seeded=true&flat=false&pageNr=0&pageSize=${this.maxPageSize}`
      );
      if (!artistsRes.ok) throw new Error("Kunde inte hämta artister");
      const artistsData = await artistsRes.json();
      
      // Filter artists based on musicGroupId
      band.artists = artistsData.pageItems.filter(artist => {
        console.log("Artist-objekt:", artist);
        return artist.musicGroupId === id;
      });
      console.log("Filtrerade artister:", band.artists);

      // Fetch albums for this music group
      const albumsRes = await fetch(
        `${this.baseUrl}/Album/Read?seeded=true&flat=false&pageNr=0&pageSize=${this.maxPageSize}`
      );
      if (!albumsRes.ok) throw new Error("Kunde inte hämta album");
      const albumsData = await albumsRes.json();
      
      // Filter albums based on musicGroupId
      band.albums = albumsData.pageItems.filter(album => {
        console.log("Album-objekt:", album);
        return album.musicGroupId === id;
      });
      console.log("Filtrerade album:", band.albums);

      //If we didn't find any artists or albums, try a different approach
      if (band.artists.length === 0 || band.albums.length === 0) {
        try {
          // Try to retrieve all data at once
          const allDataRes = await fetch(
            `${this.baseUrl}/MusicGroup/Read?seeded=true&flat=false&pageNr=0&pageSize=${this.maxPageSize}`
          );
          if (allDataRes.ok) {
            const allData = await allDataRes.json();
            const fullBand = allData.pageItems.find(group => String(group.musicGroupId) === String(id));
            if (fullBand) {
              if (band.artists.length === 0 && fullBand.artists) {
                band.artists = fullBand.artists;
              }
              if (band.albums.length === 0 && fullBand.albums) {
                band.albums = fullBand.albums;
              }
            }
          }
        } catch (error) {
          console.error("Kunde inte hämta komplett data:", error);
        }
      }
      
      return band;
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
