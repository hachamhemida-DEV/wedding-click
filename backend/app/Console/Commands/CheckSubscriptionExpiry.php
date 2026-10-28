<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Service;
use App\Models\VendorProfile;

class CheckSubscriptionExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscriptions:check-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically expire subscriptions and hide vendor listings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired subscriptions...');

        // Find active subscriptions that have expired
        $expiredSubscriptions = Subscription::where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->get();

        if ($expiredSubscriptions->isEmpty()) {
            $this->info('No expired subscriptions found.');
            return;
        }

        foreach ($expiredSubscriptions as $sub) {
            $sub->update(['status' => 'expired']);

            // Deactivate vendor profile status
            VendorProfile::where('user_id', $sub->vendor_id)
                ->update(['status' => 'inactive']);

            // Hide vendor's services from search/public list
            Service::where('vendor_id', $sub->vendor_id)
                ->update(['status' => 'hidden']);

            $this->warn("Expired subscription for Vendor ID: {$sub->vendor_id}. Vendor profile set to inactive and services hidden.");
        }

        $this->info('Finished subscription check.');
    }
}
