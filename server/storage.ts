import { type User, type InsertUser, type GlasackoMjesto, type InsertGlasackoMjesto, type Anomalija, type InsertAnomalija } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Glasacka mjesta
  getAllGlasackaMjesta(): Promise<GlasackoMjesto[]>;
  getGlasackoMjesto(id: string): Promise<GlasackoMjesto | undefined>;
  updateGlasackoMjesto(id: string, data: Partial<GlasackoMjesto>): Promise<GlasackoMjesto | undefined>;
  
  // Anomalije
  getAllAnomalije(): Promise<Anomalija[]>;
  getAnomalija(id: string): Promise<Anomalija | undefined>;
  createAnomalija(anomalija: InsertAnomalija): Promise<Anomalija>;
  updateAnomalijaStatus(id: string, status: string): Promise<Anomalija | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private glasackaMjesta: Map<string, GlasackoMjesto>;
  private anomalije: Map<string, Anomalija>;

  constructor() {
    this.users = new Map();
    this.glasackaMjesta = new Map();
    this.anomalije = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock glasačka mjesta
    const mockMjesta: GlasackoMjesto[] = [
      {
        id: "GM-0001",
        naziv: "OŠ Safvet-beg Bašagić",
        opstina: "Centar",
        entitet: "FBiH",
        grad: "Sarajevo",
        koordinate: [43.8563, 18.4131],
        status: "aktivno",
        brojBiraca: 1250,
        glasalo: 847,
        izlaznost: "67.76",
        validnihGlasova: 823,
        nevazeciGlasova: 18,
        spornihGlasova: 6,
        autentifikacije: { uspjesne: 847, neuspjesne: 23, blokirane: 2, prosjecnoVrijeme: "45s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0002",
        naziv: "Gimnazija Mostar",
        opstina: "Stari Grad",
        entitet: "FBiH",
        grad: "Mostar",
        koordinate: [43.3438, 17.8078],
        status: "upozorenje",
        brojBiraca: 980,
        glasalo: 712,
        izlaznost: "72.65",
        validnihGlasova: 698,
        nevazeciGlasova: 12,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 712, neuspjesne: 45, blokirane: 5, prosjecnoVrijeme: "38s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0003",
        naziv: "Dom kulture",
        opstina: "Novi Grad",
        entitet: "RS",
        grad: "Banja Luka",
        koordinate: [44.7722, 17.1910],
        status: "aktivno",
        brojBiraca: 1450,
        glasalo: 1089,
        izlaznost: "75.10",
        validnihGlasova: 1065,
        nevazeciGlasova: 19,
        spornihGlasova: 5,
        autentifikacije: { uspjesne: 1089, neuspjesne: 12, blokirane: 1, prosjecnoVrijeme: "42s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0004",
        naziv: "Srednja škola Brčko",
        opstina: "Centar",
        entitet: "BD",
        grad: "Brčko",
        koordinate: [44.8731, 18.8111],
        status: "aktivno",
        brojBiraca: 850,
        glasalo: 623,
        izlaznost: "73.29",
        validnihGlasova: 610,
        nevazeciGlasova: 10,
        spornihGlasova: 3,
        autentifikacije: { uspjesne: 623, neuspjesne: 8, blokirane: 0, prosjecnoVrijeme: "40s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0005",
        naziv: "OŠ Aleksa Šantić",
        opstina: "Trebinje",
        entitet: "RS",
        grad: "Trebinje",
        koordinate: [42.7123, 18.3439],
        status: "aktivno",
        brojBiraca: 1120,
        glasalo: 798,
        izlaznost: "71.25",
        validnihGlasova: 785,
        nevazeciGlasova: 11,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 798, neuspjesne: 15, blokirane: 1, prosjecnoVrijeme: "43s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0006",
        naziv: "Dom zdravlja Tuzla",
        opstina: "Centar",
        entitet: "FBiH",
        grad: "Tuzla",
        koordinate: [44.5380, 18.6709],
        status: "kriticno",
        brojBiraca: 1680,
        glasalo: 456,
        izlaznost: "27.14",
        validnihGlasova: 445,
        nevazeciGlasova: 8,
        spornihGlasova: 3,
        autentifikacije: { uspjesne: 456, neuspjesne: 87, blokirane: 12, prosjecnoVrijeme: "67s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0007",
        naziv: "Kulturni centar Zenica",
        opstina: "Centar",
        entitet: "FBiH",
        grad: "Zenica",
        koordinate: [44.2034, 17.9078],
        status: "aktivno",
        brojBiraca: 1340,
        glasalo: 967,
        izlaznost: "72.16",
        validnihGlasova: 951,
        nevazeciGlasova: 14,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 967, neuspjesne: 19, blokirane: 2, prosjecnoVrijeme: "41s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0008",
        naziv: "OŠ Mesa Selimović",
        opstina: "Novo Sarajevo",
        entitet: "FBiH",
        grad: "Sarajevo",
        koordinate: [43.8486, 18.3944],
        status: "aktivno",
        brojBiraca: 1280,
        glasalo: 945,
        izlaznost: "73.83",
        validnihGlasova: 930,
        nevazeciGlasova: 13,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 945, neuspjesne: 11, blokirane: 0, prosjecnoVrijeme: "39s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0009",
        naziv: "Srednja medicinska škola",
        opstina: "Doboj",
        entitet: "RS",
        grad: "Doboj",
        koordinate: [44.7331, 18.0870],
        status: "aktivno",
        brojBiraca: 920,
        glasalo: 678,
        izlaznost: "73.70",
        validnihGlasova: 665,
        nevazeciGlasova: 11,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 678, neuspjesne: 14, blokirane: 1, prosjecnoVrijeme: "44s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0010",
        naziv: "OŠ Hasan Kikić",
        opstina: "Vogošća",
        entitet: "FBiH",
        grad: "Sarajevo",
        koordinate: [43.9014, 18.3539],
        status: "aktivno",
        brojBiraca: 1050,
        glasalo: 756,
        izlaznost: "72.00",
        validnihGlasova: 742,
        nevazeciGlasova: 12,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 756, neuspjesne: 16, blokirane: 1, prosjecnoVrijeme: "42s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0011",
        naziv: "Dom kulture Bijeljina",
        opstina: "Centar",
        entitet: "RS",
        grad: "Bijeljina",
        koordinate: [44.7587, 19.2144],
        status: "upozorenje",
        brojBiraca: 1520,
        glasalo: 1123,
        izlaznost: "73.88",
        validnihGlasova: 1095,
        nevazeciGlasova: 23,
        spornihGlasova: 5,
        autentifikacije: { uspjesne: 1123, neuspjesne: 34, blokirane: 3, prosjecnoVrijeme: "46s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0012",
        naziv: "Muzej Kozara",
        opstina: "Prijedor",
        entitet: "RS",
        grad: "Prijedor",
        koordinate: [44.9799, 16.7119],
        status: "aktivno",
        brojBiraca: 1180,
        glasalo: 854,
        izlaznost: "72.37",
        validnihGlasova: 839,
        nevazeciGlasova: 13,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 854, neuspjesne: 18, blokirane: 2, prosjecnoVrijeme: "43s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0013",
        naziv: "JU Dom zdravlja",
        opstina: "Livno",
        entitet: "FBiH",
        grad: "Livno",
        koordinate: [43.8267, 17.0078],
        status: "aktivno",
        brojBiraca: 890,
        glasalo: 645,
        izlaznost: "72.47",
        validnihGlasova: 632,
        nevazeciGlasova: 11,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 645, neuspjesne: 13, blokirane: 1, prosjecnoVrijeme: "41s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0014",
        naziv: "Sportska dvorana Gacko",
        opstina: "Gacko",
        entitet: "RS",
        grad: "Gacko",
        koordinate: [43.1697, 18.5256],
        status: "aktivno",
        brojBiraca: 780,
        glasalo: 567,
        izlaznost: "72.69",
        validnihGlasova: 556,
        nevazeciGlasova: 9,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 567, neuspjesne: 10, blokirane: 1, prosjecnoVrijeme: "40s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0015",
        naziv: "OŠ Novi Travnik",
        opstina: "Novi Travnik",
        entitet: "FBiH",
        grad: "Novi Travnik",
        koordinate: [44.1661, 17.6675],
        status: "aktivno",
        brojBiraca: 1230,
        glasalo: 889,
        izlaznost: "72.28",
        validnihGlasova: 873,
        nevazeciGlasova: 14,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 889, neuspjesne: 17, blokirane: 1, prosjecnoVrijeme: "42s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0016",
        naziv: "Centar za kulturu Goražde",
        opstina: "Goražde",
        entitet: "FBiH",
        grad: "Goražde",
        koordinate: [43.6678, 18.9753],
        status: "aktivno",
        brojBiraca: 960,
        glasalo: 701,
        izlaznost: "73.02",
        validnihGlasova: 688,
        nevazeciGlasova: 11,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 701, neuspjesne: 15, blokirane: 1, prosjecnoVrijeme: "43s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0017",
        naziv: "Gradska vijećnica Konjic",
        opstina: "Konjic",
        entitet: "FBiH",
        grad: "Konjic",
        koordinate: [43.6514, 17.9617],
        status: "neaktivno",
        brojBiraca: 1150,
        glasalo: 0,
        izlaznost: "0.00",
        validnihGlasova: 0,
        nevazeciGlasova: 0,
        spornihGlasova: 0,
        autentifikacije: { uspjesne: 0, neuspjesne: 0, blokirane: 0, prosjecnoVrijeme: "0s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0018",
        naziv: "Dom omladine Gradiška",
        opstina: "Gradiška",
        entitet: "RS",
        grad: "Gradiška",
        koordinate: [45.1450, 17.2539],
        status: "aktivno",
        brojBiraca: 1420,
        glasalo: 1034,
        izlaznost: "72.82",
        validnihGlasova: 1015,
        nevazeciGlasova: 16,
        spornihGlasova: 3,
        autentifikacije: { uspjesne: 1034, neuspjesne: 21, blokirane: 2, prosjecnoVrijeme: "44s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0019",
        naziv: "OŠ Jajce",
        opstina: "Jajce",
        entitet: "FBiH",
        grad: "Jajce",
        koordinate: [44.3419, 17.2708],
        status: "aktivno",
        brojBiraca: 1080,
        glasalo: 789,
        izlaznost: "73.06",
        validnihGlasova: 774,
        nevazeciGlasova: 13,
        spornihGlasova: 2,
        autentifikacije: { uspjesne: 789, neuspjesne: 16, blokirane: 1, prosjecnoVrijeme: "42s" },
        zadnjeAzuriranje: new Date(),
      },
      {
        id: "GM-0020",
        naziv: "Sportski centar Cazin",
        opstina: "Cazin",
        entitet: "FBiH",
        grad: "Cazin",
        koordinate: [44.9669, 15.9431],
        status: "aktivno",
        brojBiraca: 1560,
        glasalo: 1142,
        izlaznost: "73.21",
        validnihGlasova: 1120,
        nevazeciGlasova: 18,
        spornihGlasova: 4,
        autentifikacije: { uspjesne: 1142, neuspjesne: 23, blokirane: 2, prosjecnoVrijeme: "45s" },
        zadnjeAzuriranje: new Date(),
      },
    ];

    mockMjesta.forEach(mjesto => this.glasackaMjesta.set(mjesto.id, mjesto));

    // Mock anomalije
    const mockAnomalije: Anomalija[] = [
      {
        id: randomUUID(),
        glasackoMjestoId: "GM-0006",
        tip: "kritično",
        opis: "Prekid internetske veze duži od 10 minuta",
        vrijeme: "14:45",
        status: "aktivno",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        glasackoMjestoId: "GM-0002",
        tip: "upozorenje",
        opis: "Visoka stopa neuspješnih autentifikacija",
        vrijeme: "14:20",
        status: "aktivno",
      createdAt: new Date(),
      },
      {
        id: randomUUID(),
        glasackoMjestoId: "GM-0011",
        tip: "upozorenje",
        opis: "Neobično visoka stopa nevažećih listića (>2%)",
        vrijeme: "13:55",
        status: "aktivno",
        createdAt: new Date(),
      },
    ];

    mockAnomalije.forEach(anomalija => this.anomalije.set(anomalija.id, anomalija));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Glasacka mjesta methods
  async getAllGlasackaMjesta(): Promise<GlasackoMjesto[]> {
    return Array.from(this.glasackaMjesta.values());
  }

  async getGlasackoMjesto(id: string): Promise<GlasackoMjesto | undefined> {
    return this.glasackaMjesta.get(id);
  }

  async updateGlasackoMjesto(id: string, data: Partial<GlasackoMjesto>): Promise<GlasackoMjesto | undefined> {
    const mjesto = this.glasackaMjesta.get(id);
    if (!mjesto) return undefined;
    
    const updated = { ...mjesto, ...data, zadnjeAzuriranje: new Date() };
    this.glasackaMjesta.set(id, updated);
    return updated;
  }

  // Anomalije methods
  async getAllAnomalije(): Promise<Anomalija[]> {
    return Array.from(this.anomalije.values());
  }

  async getAnomalija(id: string): Promise<Anomalija | undefined> {
    return this.anomalije.get(id);
  }

  async createAnomalija(insertAnomalija: InsertAnomalija): Promise<Anomalija> {
    const id = randomUUID();
    const anomalija: Anomalija = { 
      ...insertAnomalija, 
      id,
      createdAt: new Date()
    };
    this.anomalije.set(id, anomalija);
    return anomalija;
  }

  async updateAnomalijaStatus(id: string, status: string): Promise<Anomalija | undefined> {
    const anomalija = this.anomalije.get(id);
    if (!anomalija) return undefined;
    
    const updated = { ...anomalija, status };
    this.anomalije.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
