<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test vendor if none exists
        $vendor = User::where('role', 'vendor')->first();

        if (!$vendor) {
            $vendor = User::create([
                'name' => 'Studio Ahmed',
                'email' => 'vendor@test.com',
                'password' => Hash::make('password123'),
                'role' => 'vendor',
                'phone' => '+213555000111',
            ]);
            $vendor->vendorProfile()->create([
                'business_name' => 'Studio Ahmed Photography',
                'category' => 'photography',
                'phone' => '+213555000111',
                'wilaya' => 'Alger',
            ]);
        }

        $services = [
            [
                'vendor_id' => $vendor->id,
                'category_id' => 1, // halls
                'title' => 'Salle El Riad - Alger',
                'description' => 'Salle de fêtes luxueuse avec une capacité de 500 personnes. Décoration moderne, climatisation, parking gratuit.',
                'price' => 250000.00,
                'wilaya' => 'Alger',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Salle+El+Riad'],
                'status' => 'active',
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => 2, // photography
                'title' => 'Pack Photo & Vidéo Premium',
                'description' => 'Couverture complète de votre mariage. Photos, vidéo drone, album imprimé. Expérience de 10 ans.',
                'price' => 80000.00,
                'wilaya' => 'Alger',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Photo+Premium'],
                'status' => 'active',
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => 3, // catering
                'title' => 'Traiteur El Baraka',
                'description' => 'Menu traditionnel algérien complet: entrées, plats, desserts. Service pour 100 à 1000 convives.',
                'price' => 150000.00,
                'wilaya' => 'Oran',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Traiteur'],
                'status' => 'active',
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => 4, // decoration
                'title' => 'Décoration Florale - Yasmine Events',
                'description' => 'Décoration florale complète pour votre mariage. Arches, centres de table, entrée de salle.',
                'price' => 45000.00,
                'wilaya' => 'Constantine',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Decoration'],
                'status' => 'active',
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => 7, // makeup
                'title' => 'Maquillage & Coiffure Mariée VIP',
                'description' => 'Mise en beauté complète: maquillage, coiffure, essai préalable inclus. À domicile.',
                'price' => 25000.00,
                'wilaya' => 'Alger',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Maquillage'],
                'status' => 'active',
            ],
            [
                'vendor_id' => $vendor->id,
                'category_id' => 5, // cakes
                'title' => 'Gâteau de Mariage 5 Étages',
                'description' => 'Gâteau sur mesure, 5 étages, décoration personnalisée. Livraison incluse.',
                'price' => 35000.00,
                'wilaya' => 'Sétif',
                'images' => ['https://placehold.co/800x600/B8956A/FFF?text=Gateau'],
                'status' => 'active',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
