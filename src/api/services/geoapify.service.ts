import axios from "axios";
import { I_PharmacyAddress } from "../../interfaces/pharmacy.interfaces";

export default class GeoapifyService {
  async coordinatesByCep(cep: string): Promise<any> {
    const url = `${process.env.GEOAPIFY_URL}/search?postcode=${cep}&country=BR&format=json&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    const result = response.data.results[0];

    if (!result) throw new Error("CEP não encontrado");

    return { lat: result.lat, lon: result.lon };
  }

  async addressByCep(address: I_PharmacyAddress): Promise<any> {
    const url = `${process.env.GEOAPIFY_URL}/search?postcode=${address.cep}&filter=countrycode:br&lang=pt&apiKey=${process.env.GEOAPIFY_API_KEY}`;

    const response = await axios.get(url);
    const result = response.data.features[0].properties;

    if (!result) throw new Error("CEP não encontrado");

    const geoapifyAddress = {
      street: result.street || "Nome da rua não encontrado",
      neighborhood: result.suburb,
      complement: address.complement,
      number: address.number,
      city: result.city,
      state: result.state_code,
      cep: address.cep,
      lat: result.lat.toString(),
      lon: result.lon.toString(),
    };

    return geoapifyAddress;
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
