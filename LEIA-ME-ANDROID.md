# LiveBox para Android TV (Xiaomi TV Box)

É o mesmo LiveBox do Windows (Início, Agora na TV, Canais, favoritos, várias listas, agenda, multiview…), rodando
dentro de um app Android e controlado pelo **controle remoto**.

## Como gerar o APK (sem instalar nada no PC)

O GitHub compila para você, de graça.

1. Crie uma conta em github.com (se ainda não tiver) e clique em **New repository**. Nome: `livebox-tv`.
   Deixe **Public** (é o que permite baixar o APK direto pela TV; o app não tem nenhuma senha dentro).
2. Na página do repositório vazio, clique em **uploading an existing file** e **arraste o CONTEÚDO desta pasta**
   (tudo que está dentro de `android`, inclusive a pasta oculta `.github`). Clique em **Commit changes**.
   - Se a pasta `.github` não subir (alguns navegadores escondem pastas ocultas): clique em **Add file → Create new file**,
     digite o nome `.github/workflows/apk.yml`, cole o conteúdo do arquivo `apk.yml` e faça o commit.
3. Abra a aba **Actions**. Vai aparecer "Gerar APK do LiveBox TV" rodando (leva uns 3–5 minutos). Quando ficar verde ✓, está pronto.
   Se ficar vermelho ✗, clique nele e me mande uma foto/texto do erro.
4. O APK fica em dois lugares: em **Releases** (à direita na página do repositório → `LiveBox-TV.apk`) e dentro da execução
   em Actions, em *Artifacts*.

## Como instalar na Xiaomi TV Box

Opção A — **Downloader** (mais fácil):
1. Na TV Box, instale o app **Downloader** (Google Play, na TV).
2. Em *Configurações → Segurança e restrições → Fontes desconhecidas*, permita o **Downloader** (o nome do menu varia).
3. No Downloader, digite o endereço:
   `https://github.com/SEU-USUARIO/livebox-tv/releases/download/apk/LiveBox-TV.apk`
   (troque `SEU-USUARIO` pelo seu usuário do GitHub), baixe e toque em **Instalar**.

Opção B — **pendrive**: copie o `LiveBox-TV.apk` para um pendrive, espete na TV Box e abra com um gerenciador de arquivos
(ex.: *File Commander* ou *X-plore*), permitindo a instalação de fontes desconhecidas.

Opção C — **ADB** (para quem usa): `adb connect IP-DA-TV:5555` e `adb install -r LiveBox-TV.apk`.

Para atualizar no futuro, instale o APK novo por cima; seus favoritos e listas ficam guardados.

## Controle remoto

| Botão | Início / Agora na TV | Assistindo |
|---|---|---|
| ◀ ▶ ▲ ▼ | andar entre os cartões e botões | ▲▼ troca de canal · ◀ abre a lista de canais · ▶ abre as opções |
| OK | abrir / assistir | abre a lista de canais |
| Voltar | sobe um nível (Assistindo → Início). No Início, aperte 2x para sair | fecha lista/menu, depois volta ao Início |
| Menu (≡) / Info | no item selecionado: opções (favoritar, ocultar, avisar…) | opções (proporção, áudio, legenda, sono) |
| ▶❚❚ | | pausa / continua |
| CH+ / CH− | | troca de canal |
| números | | vai direto ao canal |

Na lista de canais (aberta sobre o vídeo): ▲▼ escolhe, **◀ ▶ trocam de categoria**, OK assiste.
Para buscar, vá ao Início, suba até a lupa e aperte OK (aparece o teclado da TV); ao terminar, aperte Enter.

Se a TV Box não tem o botão Menu, use ▶ enquanto assiste para abrir as opções (lá tem "Favoritos e organizar este canal").

## Observações

- **WebView**: o app usa o "Android System WebView" da TV. Se aparecer um aviso vermelho sobre WebView antigo, atualize-o na Play Store.
- Backup/restauração: o arquivo `livebox-backup.json` fica em `Android/data/br.livebox.tv/files/`.
- Gravações (.webm): `Android/data/br.livebox.tv/files/Movies/LiveBox/`. (Em TV Box o espaço costuma ser pequeno.)
- Para mudar o app: o visual é a pasta `../renderer`. Depois de alterar, rode `npm install` e `npm run build:www` aqui
  e suba os arquivos de novo.

## Estrutura

- `app/src/main/java/.../MainActivity.java` — a WebView, teclas do controle remoto, arquivos e gravação.
- `bridge/` — liga a interface à lógica compartilhada em `../src` (listas, guia, verificador).
- `build-www.js` — monta `app/src/main/assets/www` (já vem pronto no projeto).
