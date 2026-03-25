module greenproof::task_registry {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::String;
    use std::vector;
    use std::option::{Self, Option};
    use sui::event;
    use greenproof::validator_token::{Self, CompanyToken};

    // --- Errors ---
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INVALID_STATUS: u64 = 2;
    const E_INSUFFICIENT_LEVEL: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;

    // --- Structs ---
    public struct TaskRegistry has key {
        id: UID,
        company_id: String
    }

    public struct Submission has store {
        validator_id: address,
        blob_id: String,
        diagnosis: String,
        qc_score: Option<u8>,
        submitted_at: u64
    }

    public struct Task has key {
        id: UID,
        company_id: String,
        title: String,
        task_type: u8, // 0=kondisi, 1=hitung, 2=health, 3=anomali, 4=kritis
        coordinates: vector<u8>,
        reward_amount: u64,
        min_validator_level: u8,
        status: u8, // 0=draft, 1=pub, 2=prog, 3=flagged, 4=completed
        submissions: vector<Submission>,
        created_at: u64,
        escrow_coin: Option<CompanyToken>
    }

    // --- Events ---
    public struct TaskCreated has copy, drop { task_id: address, title: String, reward: u64 }
    public struct SubmissionReceived has copy, drop { task_id: address, validator: address, blob_id: String }
    public struct RewardReleased has copy, drop { task_id: address, validator: address, amount: u64 }

    // Init Registry untuk perusahaan
    public fun create_registry(company_id: String, ctx: &mut TxContext): TaskRegistry {
        TaskRegistry {
            id: object::new(ctx),
            company_id
        }
    }

    // Publish task dan kunci koin
    public fun create_task(
        _registry: &TaskRegistry,
        company_id: String,
        title: String,
        task_type: u8,
        coordinates: vector<u8>,
        reward_amount: u64,
        min_validator_level: u8,
        coin: CompanyToken,
        ctx: &mut TxContext
    ) {
        assert!(validator_token::value(&coin) == reward_amount, E_INSUFFICIENT_BALANCE);
        
        let task = Task {
            id: object::new(ctx),
            company_id,
            title,
            task_type,
            coordinates,
            reward_amount,
            min_validator_level,
            status: 1, // Published
            submissions: vector::empty(),
            created_at: tx_context::epoch_timestamp_ms(ctx),
            escrow_coin: option::some(coin)
        };

        event::emit(TaskCreated {
            task_id: object::uid_to_address(&task.id),
            title: task.title,
            reward: task.reward_amount
        });

        transfer::share_object(task);
    }

    // Claim mengubah status
    public fun claim_task(task: &mut Task, _ctx: &mut TxContext) {
        assert!(task.status == 1, E_INVALID_STATUS);
        task.status = 2; // In Progress
    }

    // Submit eviden
    public fun submit_validation(
        task: &mut Task,
        blob_id: String,
        diagnosis: String,
        ctx: &mut TxContext
    ) {
        assert!(task.status == 2, E_INVALID_STATUS);
        let validator_id = tx_context::sender(ctx);

        let sub = Submission {
            validator_id,
            blob_id,
            diagnosis,
            qc_score: option::none(),
            submitted_at: tx_context::epoch_timestamp_ms(ctx)
        };

        vector::push_back(&mut task.submissions, sub);

        event::emit(SubmissionReceived {
            task_id: object::uid_to_address(&task.id),
            validator: validator_id,
            blob_id
        });
    }

    // Servis backend API memanggil ini setelah LLM lulus
    public fun release_reward(
        task: &mut Task,
        validator_addr: address,
        _ctx: &mut TxContext
    ): CompanyToken {
        assert!(task.status == 2 || task.status == 3, E_INVALID_STATUS);
        task.status = 4; // Completed
        
        let coin = option::extract(&mut task.escrow_coin);
        
        event::emit(RewardReleased {
            task_id: object::uid_to_address(&task.id),
            validator: validator_addr,
            amount: validator_token::value(&coin)
        });

        coin // Return koin ke servis, servis yang mengirimkannya ke wallet validator
    }

    public fun flag_task(task: &mut Task, _reason: String, _ctx: &mut TxContext) {
        assert!(task.status == 2, E_INVALID_STATUS);
        task.status = 3; // Flagged
    }
}