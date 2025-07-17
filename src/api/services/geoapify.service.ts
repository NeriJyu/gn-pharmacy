import axios from "axios";

export default class GeoapifyService {
  async coordinatesByCep(cep: string): Promise<any> {
    const url = `https://api.geoapify.com/v1/geocode/search?postcode=${cep}&country=BR&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    const result = response.data.results[0];

    console.log("response: ", response);

    if (!result) throw new Error("CEP não encontrado");

    console.log(`CEP ${cep}: lat=${result.lat}, lon=${result.lon}`);
    console.log("teste: ", result.lat.toString());

    return { lat: result.lat, lon: result.lon };
  }

  calculateDistanceInKM(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const toRad = (graus: number) => (graus * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = R * c;

    return parseFloat(distancia.toFixed(2));
  }
}
