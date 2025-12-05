export const formatarMoeda = (valor: number | string): string => {
    const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (isNaN(numericValue)) {
        return "R$ 0,00";
    }
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(numericValue);
};
