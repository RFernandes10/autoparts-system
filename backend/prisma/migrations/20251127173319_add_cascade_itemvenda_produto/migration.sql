-- DropForeignKey
ALTER TABLE "itens_venda" DROP CONSTRAINT "itens_venda_produtoId_fkey";

-- AddForeignKey
ALTER TABLE "itens_venda" ADD CONSTRAINT "itens_venda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
