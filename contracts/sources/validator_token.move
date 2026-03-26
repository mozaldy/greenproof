module greenproof::validator_token {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;
    use sui::event;

    // --- Errors ---
    const E_INSUFFICIENT_BALANCE: u64 = 1;

    // --- Objek Admin (Hanya untuk GreenProof Deployer) ---
    public struct GreenproofAdminCap has key, store {
        id: UID
    }

    // --- Objek Treasury (Satu per Perusahaan) ---
    public struct CompanyTreasuryCap has key, store {
        id: UID,
        company_id: String,
        name: String,
        symbol: String,
        total_supply: u64
    }

    // --- Objek Token (Closed-loop) ---
    public struct CompanyToken has key, store {
        id: UID,
        company_id: String,
        amount: u64
    }

    // --- Events ---
    public struct TokenMinted has copy, drop {
        company_id: String,
        amount: u64,
        recipient: address,
        task_id: String
    }

    public struct TokenBurned has copy, drop {
        company_id: String,
        amount: u64
    }

    // Init: Berikan AdminCap ke wallet deployer
    fun init(ctx: &mut TxContext) {
        transfer::transfer(
            GreenproofAdminCap { id: object::new(ctx) },
            tx_context::sender(ctx)
        );
    }

    // Factory: Deployer membuat token baru untuk onboarding perusahaan
    public fun create_company_token(
        _admin: &GreenproofAdminCap,
        company_id: String,
        name: String,
        symbol: String,
        ctx: &mut TxContext
    ): CompanyTreasuryCap {
        CompanyTreasuryCap {
            id: object::new(ctx),
            company_id,
            name,
            symbol,
            total_supply: 0
        }
    }

    // Minting: Dipanggil oleh wallet perusahaan (pemegang TreasuryCap)
    public fun mint(
        cap: &mut CompanyTreasuryCap,
        amount: u64,
        task_id: String,
        ctx: &mut TxContext
    ): CompanyToken {
        cap.total_supply = cap.total_supply + amount;
        
        event::emit(TokenMinted {
            company_id: cap.company_id,
            amount,
            recipient: tx_context::sender(ctx),
            task_id
        });

        CompanyToken {
            id: object::new(ctx),
            company_id: cap.company_id,
            amount
        }
    }

    // Merge: Operasi standar koin
    public fun join(self: &mut CompanyToken, coin: CompanyToken) {
        let CompanyToken { id, company_id: _, amount } = coin;
        self.amount = self.amount + amount;
        object::delete(id);
    }

    // Split: Membagi saldo
    public fun split(self: &mut CompanyToken, split_amount: u64, ctx: &mut TxContext): CompanyToken {
        assert!(self.amount >= split_amount, E_INSUFFICIENT_BALANCE);
        self.amount = self.amount - split_amount;
        CompanyToken {
            id: object::new(ctx),
            company_id: self.company_id,
            amount: split_amount
        }
    }

    // Getters
    public fun value(token: &CompanyToken): u64 { token.amount }
    public fun company_id(token: &CompanyToken): String { token.company_id }
}