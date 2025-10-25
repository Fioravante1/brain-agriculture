# Pasta Pages Vazia

Esta pasta existe para evitar que o Next.js tente usar `src/pages` como o Pages Router.

## Por que isso é necessário?

- Usamos o **App Router** do Next.js (localizado em `/app`)
- Também usamos **Feature-Sliced Design** com uma camada `src/pages` para composições de páginas
- Sem esta pasta `pages` vazia na raiz, o Next.js tentaria usar `src/pages` como o Pages Router, o que quebraria o build
- Esta pasta vazia diz ao Next.js para ignorar `src/pages` para fins de roteamento

## Estrutura do Projeto

```
projeto/
├── app/                    # Next.js App Router (rotas)
├── pages/                  # Esta pasta vazia (previne conflito)
└── src/
    ├── pages/              # Camada FSD pages (composições de páginas)
    ├── widgets/            # Camada FSD widgets
    ├── features/           # Camada FSD features
    ├── entities/           # Camada FSD entities
    └── shared/             # Camada FSD shared
```

Para mais informações, consulte: https://feature-sliced.design/docs/guides/tech/with-nextjs
