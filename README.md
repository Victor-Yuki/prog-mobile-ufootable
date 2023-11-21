# prog-mobile-ufootable

Para testar o código
1. instalar os node_modules
> npm i
2. fazer o build o projeto
> ionic build
3. adicionar a pasta android
> ionic capacitor add android
4. aplicar o appicon e splash screen
> npx capacitor-assets generate
5. preparar para executar no Android Studio
> ionic cap build android
6. executar o aplicativo no Android Studio em um dispositivo virtual ou conectado.

caso o aplicativo trave ao clicar em uma opção de 'Manage *' ou clicar em algum nome:
  1. feche o aplicativo
  2. abra o aplicativo novamente, o problema deve ter sido resolvido.

versões utilizadas no desenvolvimento:
  - node v20.9.0
  - npm 10.1.0
  - ionic 7.1.5
  - java 21.0.1
