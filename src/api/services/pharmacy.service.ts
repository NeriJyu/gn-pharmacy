import { I_PharmacyStock } from "../../interfaces/pharmacy.interfaces";

export default class PharmacyService {
  formatPharmacyListToString(
    pharmacies: I_PharmacyStock[],
    validMedicineNames: String[]
  ): string {
    if (!pharmacies.length) {
      const formattedNames = validMedicineNames.join(", ");
      return `Nenhuma farmácia encontrada com os medicamentos: ${formattedNames}.`;
    }

    return pharmacies
      .map((pharmacy, index) => {
        const { pharmacyName, phone, address, price, quantity, medicineName } = pharmacy;
        const { street, number, complement, neighborhood, city, state, cep } =
          address;

        const endereco = `${street}, ${number}${
          complement ? `, ${complement}` : ""
        } - ${neighborhood}, ${city} - ${state}, CEP: ${cep}`;

        return `Farmácia ${index + 1}: Nome: ${pharmacyName} | Endereço: ${endereco} | Telefone: ${phone} | Medicamento: ${medicineName} | Preço: R$ ${price.toFixed(
          2
        )} | Quantidade: ${quantity}`;
      })
      .join(" | ");
  }
}

