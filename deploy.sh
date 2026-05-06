#!/bin/bash
set -e

source "$(dirname "$0")/.env.deploy"

FILES=(index.html formulario.html manual-cliente.html manifest.json .htaccess Logo.png)

echo "Iniciando deploy para $FTP_DIR..."

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "  Enviando $FILE..."
    curl -s --ftp-create-dirs -T "$FILE" \
      "ftp://$FTP_SERVER/$FTP_DIR$FILE" \
      --user "$FTP_USER:$FTP_PASS"
    echo "  ✓ $FILE"
  fi
done

echo ""
echo "Deploy concluído! Site: https://crm.gislainebarbeto.com.br"
