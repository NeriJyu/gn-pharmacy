export enum OpenAIEnum {
  MODEL = "gpt-4o",
  TEMPERATURE = 0.7,
  CONTENT_SELECT_MEDICINES_BY_IMAGE = `Liste todos os nomes de medicamentos identificados na imagem da receita médica. Se algum nome estiver incorreto ou incompleto, corrija e substitua pelo nome mais provável. Responda somente com separação por vírgulas e sempre em letra minúscula, exemplo: "dipirona,paracetamol,ibuprofeno".`,
  INSTRUCTION_SELECT_MEDICINES_BY_IMAGE = "Você é um assistente que extrai nomes de medicamentos de uma imagem de receita médica.",
  INSTRUCTION_SELECT_MEDICINES = "Você é um assistente que extrai nomes de medicamentos da mensagem do usuário.",
  INSTRUCTION_RECOMMENDATE_MEDICINE = "Você é uma API de farmácia chamada Gn-Pharmacy. Responda com base no JSON enviado. Use apenas os dados fornecidos.",
}
