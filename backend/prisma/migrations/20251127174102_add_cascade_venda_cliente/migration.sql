-- DropForeignKey
ALTER TABLE "vendas" DROP CONSTRAINT "vendas_clienteId_fkey";

-- AddForeignKey
ALTER TABLE "vendas" ADD CONSTRAINT "vendas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
