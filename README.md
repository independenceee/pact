<div align="center">

<img src="https://hydra.family/head-protocol/img/hydra.png" width="120" alt="HydraTipJar Logo" />

# **HydraPact**

**A decentralized group funding platform powered by Cardano's Hydra Layer 2 for secure, trustless, and low-cost multi-party contributions**

[![Next.js](https://img.shields.io/badge/Next.js-13-blue?logo=nextdotjs)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Container-blue?logo=docker)](https://www.docker.com/)
[![Aiken](https://img.shields.io/badge/Aiken-Smart%20Contracts-orange?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkY2NjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHBhdGggZD0iTTExLjUgM0M2LjI1IDMgMiA3LjI1IDIgMTJzNC4yNSA5IDkuNSA5IDkuNS00LjI1IDkuNS05LTQuMjUtOS41LTktOS41eiIvPjwvc3ZnPg==)](https://aiken-lang.org/)
[![Cardano](https://img.shields.io/badge/Cardano-Hydra%20L2-green?logo=cardano)](https://cardano.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

</div>

## About HydraPact

HydraPact is an open-source decentralized application (dApp) built on the Cardano blockchain, designed to enable secure, trustless group funding without intermediaries. Leveraging **Cardano's Hydra Layer 2** scaling solution, HydraPact allows groups to collaboratively pool funds for shared goals—such as purchasing NFTs, funding small projects, or supporting community initiatives—within a multi-party Hydra Head. Contributions are secured by Aiken-compiled smart contracts, ensuring funds are only disbursed to a designated wallet when all participants fulfill their pledges, delivering near-instant transactions with fees below 0.01 ADA.

The project serves as both a practical tool for groups and a reference implementation for developers exploring complex, multi-party state management in Hydra. It uses **Next.js 13** for a responsive frontend, **Aiken** for secure smart contracts, and **Hydra** for high-throughput, low-latency off-chain transactions. As of September 2025, HydraPact is in active development, with ongoing testing on Cardano's preview and testnet environments. Licensed under the MIT License, it is maintained by the GitHub user "independenceee" and showcases Hydra's potential for conditional, multi-party dApps.

### Key Benefits

-   **Speed**: Contributions are processed in under 1 second via Hydra's off-chain state channels.
-   **Low Costs**: Transaction fees are negligible (<0.01 ADA), enabling efficient group funding.
-   **Trustless**: No intermediaries; smart contracts enforce "all-or-nothing" funding logic.
-   **Scalability**: Hydra supports thousands of TPS per head, ideal for groups of varying sizes.
-   **Security**: Aiken smart contracts and Hydra's contestable commits ensure robust protection.
-   **Transparency**: All participants can view real-time contribution statuses within the Hydra Head.

### Use Cases

-   **NFT Purchases**: Groups pool ADA to buy NFTs without relying on an escrow.
-   **Crowdfunding**: DAOs or communities fund projects with transparent contribution tracking.
-   **Developer Teams**: Collect contributions for open-source projects or hackathons.
-   **Charity Pools**: Securely gather donations with automated disbursement to verified causes.

---

## 🌐 Features

HydraPact combines an intuitive interface with advanced blockchain technology to streamline group funding. Below are its core features:

-   **Create Funding Pacts**  
    Users can initiate a pact by defining participants, contribution amounts per member, and a destination wallet address. The pact is secured within a Hydra Head.

-   **Multi-Party Participation**  
    Supports inviting multiple participants to a single Hydra Head. Each member joins via wallet confirmation, ensuring secure and verifiable participation.

-   **Secure Contributions**  
    Participants commit their pledged ADA within the Hydra Head. Aiken smart contracts validate each contribution, ensuring the correct amount is sent.

-   **Real-Time Status Dashboard**  
    A WebSocket-powered dashboard displays contribution statuses (e.g., "Contributed: 2/3"), participant details, and pact progress. Features include sorting, filtering, and aggregate stats.

-   **Automatic Disbursement**  
    Once all participants contribute, the smart contract automatically triggers a transaction to transfer the total funds to the destination wallet, with settlement on Layer 1.

-   **Wallet Integration**  
    Seamlessly connects with Cardano wallets (Nami, Eternl, Flint, Lace, Yoroi, etc.) via CIP-30. Supports mainnet and preview/testnet switching.

-   **Dockerized Deployment**  
    Fully containerized with Docker Compose, including Next.js frontend, Hydra node, PostgreSQL, and Nginx, enabling easy local or cloud deployment.

-   **Enhanced UI/UX**  
    Built with TailwindCSS and Radix UI for responsive, WCAG-compliant design. Real-time updates and robust error handling ensure a smooth experience.

-   **Analytics & Transparency**  
    Visualizes contribution trends via Recharts. All participants have access to transparent, real-time pact data within the Hydra Head.

---

## 🛠️ Technology Stack

| Component           | Technologies                                         | Purpose                                                                 |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| **Frontend**        | Next.js 13, React, TypeScript, TailwindCSS, Radix UI | Server-side rendered UI for performance, SEO, and accessibility.        |
| **Blockchain**      | Mesh SDK, CIP-30, Blockfrost/Koios API               | Wallet integration, transaction building, and blockchain queries.       |
| **Layer 2**         | Hydra Protocol (Rust-based nodes)                    | Off-chain state channels for multi-party, high-throughput transactions. |
| **Smart Contracts** | Aiken (compiles to Plutus Core)                      | Secure, conditional logic for contribution validation and disbursement. |
| **Deployment**      | Docker Compose, Nginx                                | Containerized services for easy local and cloud deployment.             |
| **Data**            | PostgreSQL, WebSockets                               | Off-chain storage for logs and real-time dashboard updates.             |

---

## ⚡ Getting Started

Follow these steps to set up HydraPact locally or deploy it for production. Prerequisites: Node.js 18+, Docker, and a Cardano wallet with testnet ADA (use the [Cardano faucet](https://docs.cardano.org/cardano-testnet/faucet)).

1. **Clone the Repository**

    ```bash
    git clone https://github.com/independenceee/pact.git
    cd pact
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment**

    - Copy the example env file: `cp .env.example .env`
    - Edit `.env`:
        - `BLOCKFROST_API_KEY`: Obtain from [Blockfrost](https://blockfrost.io/).
        - `NETWORK`: Set to `preview` (testnet) or `mainnet`.
        - `MIN_CONTRIBUTION_AMOUNT`: Default is `1000000` (1 ADA in lovelace).
        - `HYDRA_NODE_URL`: Local or remote Hydra node (e.g., `ws://localhost:4001`).
    - Install and run a Hydra node (see [Hydra Docs](https://hydra.family/head-protocol/)).

4. **Run Locally**

    ```bash
    npm run dev
    ```

    Access at [http://localhost:3000](http://localhost:3000). Connect wallets, create a pact, and test contributions.

5. **Build for Production**

    ```bash
    npm run build
    npm start
    ```

    Optimized build served on port 3000.

6. **Docker Compose**

    ```bash
    docker-compose up --build
    ```

    Launches all services (frontend, Hydra node, PostgreSQL, Nginx). Scale Hydra nodes with `docker-compose scale hydra-node=3` for multi-party setups.

**Troubleshooting**:

-   **Wallet Issues**: Ensure CIP-30 compatibility and browser extensions are enabled.
-   **Hydra Errors**: Verify node sync with `hydra-node --help`. Check network alignment (preview/mainnet).
-   **Test ADA**: Request from the Cardano testnet faucet.

---

## 📁 Project Structure

The project follows a modular monorepo structure for maintainability:

-   **`src/`** — Core frontend code (TypeScript/React)

    -   `components/` — Reusable UI elements (e.g., `PactCreator.tsx`, `ContributionStatus.tsx`)
    -   `hooks/` — Custom React hooks (e.g., `useHydraPact.ts`, `useWalletTx.ts`)
    -   `services/` — API integrations (e.g., `hydraService.ts`, `explorerService.ts`)
    -   `txbuilders/` — Transaction logic (e.g., `pactTxBuilder.ts`)
    -   `constants/` — Configs (e.g., `walletList.ts`, `networkParams.ts`)
    -   `types/` — TypeScript interfaces (e.g., `PactState`, `ContributionEvent`)
    -   `utils/` — Helpers (e.g., `formatLovelace.ts`, `validateSignature.ts`)

-   **`contract/`** — Smart contract sources

    -   Aiken scripts: `pact_validator.aiken` (validates contributions), `head_setup.aiken` (initializes Hydra Heads)
    -   Compiled outputs: Plutus JSON for deployment

-   **`public/`** — Static assets

    -   Images: Hydra logo, wallet icons
    -   Favicon and PWA manifest

-   **`env/`** — Environment configurations

    -   `.env.example`: Template for API keys and settings
    -   Docker-specific overrides

-   **`docker-compose.yml`** — Orchestrates services: Next.js, Hydra node, PostgreSQL, Nginx

-   **`scripts/`** — Deployment and build utilities (e.g., `deploy-contracts.sh`)

-   **Root Files**:
    -   `README.md` — Project documentation
    -   `CONTRIBUTING.md` — Contribution guidelines
    -   `LICENSE` — MIT License
    -   `package.json` — Dependencies and scripts

---

## 🧑‍💻 Developer Notes

-   **Hydra Workflow**: Participants commit ADA to a Hydra Head, contribute within the Head, and the smart contract disburses funds upon completion. Transactions are validated by Aiken scripts.
-   **Smart Contract Logic**: The `pact_validator.aiken` script enforces "all-or-nothing" contributions, using a shared state to track participant pledges.
-   **Testing**: Run `npm test` for Jest unit tests. End-to-end tests use Playwright in `/tests/`.
-   **Extending**: Add new wallets in `src/constants/wallets.ts`. Extend Aiken scripts for custom conditions (e.g., native token support).
-   **Performance**: Hydra scales linearly with participants. Benchmark with `/benchmarks/` scripts.
-   **Security**: Aiken reduces smart contract errors, and Hydra's contestable commits prevent double-spending.

For advanced setup, refer to [Hydra Docs](https://hydra.family/head-protocol/) and [Aiken Book](https://aiken-lang.org/book/).

---

## 🤝 Contributing

We welcome contributions to enhance HydraPact! Whether fixing bugs, adding features (e.g., multi-token support), or improving docs, your input is valued.

1. Fork the repository and create a feature branch:
    ```bash
    git checkout -b feature/your-idea
    ```
2. Commit changes with clear messages:
    ```bash
    git commit -m "Add: your idea with tests"
    ```
3. Push to your fork:
    ```bash
    git push origin feature/your-idea
    ```
4. Open a Pull Request on GitHub, linking to relevant issues.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details:

-   Follow ESLint/Prettier for code style.
-   Include tests for new features.
-   Discuss breaking changes in issues first.

Report bugs or suggest features via GitHub Issues. Join the Cardano developer community on Discord or X for collaboration.

---

## 📚 Documentation & Resources

-   [API Reference](docs/API.md) — Details on endpoints and data types
-   [Hydra Setup Guide](docs/hydra-setup.md) — Node configuration and troubleshooting
-   [Smart Contract Breakdown](docs/contracts.md) — Aiken script explanations
-   Cardano Ecosystem:
    -   [Cardano Developer Portal](https://developers.cardano.org/)
    -   [Hydra RFCs](https://github.com/cardano-scaling/hydra)
    -   [Mesh SDK Docs](https://meshjs.dev/)
    -   [Aiken Language Book](https://aiken-lang.org/book/)

---

## 📝 License

This project is licensed under the [MIT License](LICENSE). Copyright © 2025 independenceee. Free to use, modify, and distribute.
