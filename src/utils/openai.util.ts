export const recommendateMedicineInput = (
  pharmacies: string,
  medicines: String[]
): string => {
  return `Os remédios são: ${medicines}. Este é o JSON de farmácias: ${pharmacies}

Liste onde cada remédio está disponível no seguinte formato para cada item:

"O remédio 'NOME_DO_REMEDIO' está disponível na(s) seguinte(s) farmácia(s):"

E, para cada farmácia, utilize os seguintes campos com emojis:

🏥 Nome:  
📍 Endereço:  
📞 Telefone:  
💰 Preço:  
📦 Quantidade disponível:  

❗ Não inclua informações fora desse escopo.  
❗ Responda apenas com essas informações para cada remédio listado.`;
};

export const selectMedicinesInput = (message: string): string => {
  return `Liste todos os nomes de medicamentos mencionados nesta frase: "${message}". Se algum nome estiver incorreto ou incompleto, corrija e substitua pelo nome mais provável. Responda somente com separação por vírgulas e sempre em letra minuscula, exemplo: "dipirona,paracetamol,ibuprofeno"`;
};
