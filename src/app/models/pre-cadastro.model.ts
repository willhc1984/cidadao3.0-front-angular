export interface CidadaoPreCadastro{
    nome: string;
    dataDeNascimento: string;
    email: string;
    sexo: 'M' | 'F';
    rg: string;
    cpf: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    celular: string;
    cep: string;
    numeroEleitoral: string;
}