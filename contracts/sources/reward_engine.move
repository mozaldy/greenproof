module greenproof::reward_engine {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;
    use sui::event;

    // --- Structs ---
    public struct ValidatorReputation has key {
        id: UID,
        company_id: String,
        validator_addr: address,
        tasks_completed: u64,
        accuracy_score: u64, // Disimpan sebagai persentase 0-100
        level: u8,
        total_earned: u64
    }

    // --- Events ---
    public struct LevelUp has copy, drop {
        validator: address,
        old_level: u8,
        new_level: u8
    }

    public fun create_reputation(
        company_id: String,
        validator_addr: address,
        ctx: &mut TxContext
    ) {
        let rep = ValidatorReputation {
            id: object::new(ctx),
            company_id,
            validator_addr,
            tasks_completed: 0,
            accuracy_score: 100, // Mulai dari 100%
            level: 1,
            total_earned: 0
        };
        transfer::share_object(rep);
    }

    // Basis poin: 1=100%, 2=150%, 3=200%
    public fun calculate_reward(base_amount: u64, validator_level: u8): u64 {
        if (validator_level == 3) {
            return base_amount * 200 / 100
        } else if (validator_level == 2) {
            return base_amount * 150 / 100
        };
        base_amount
    }

    public fun update_reputation(
        rep: &mut ValidatorReputation,
        was_correct: bool,
        _ctx: &mut TxContext
    ) {
        // Logika MVP untuk Akurasi
        let old_score = rep.accuracy_score;
        let new_score = if (was_correct) {
            if (old_score < 100) { old_score + 1 } else { 100 }
        } else {
            if (old_score > 5) { old_score - 5 } else { 0 }
        };
        
        rep.accuracy_score = new_score;
        
        if (was_correct) {
            rep.tasks_completed = rep.tasks_completed + 1;
        };

        // Logika Auto Promosi
        let old_level = rep.level;
        if (rep.level == 1 && rep.tasks_completed >= 50 && rep.accuracy_score >= 75) {
            rep.level = 2;
        } else if (rep.level == 2 && rep.tasks_completed >= 200 && rep.accuracy_score >= 85) {
            rep.level = 3;
        };

        if (old_level != rep.level) {
            event::emit(LevelUp {
                validator: rep.validator_addr,
                old_level,
                new_level: rep.level
            });
        }
    }
}