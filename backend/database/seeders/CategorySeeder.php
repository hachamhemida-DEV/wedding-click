<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'slug' => 'halls',
                'name_fr' => 'Salles des fêtes',
                'name_ar' => 'قاعات الحفلات',
                'icon' => 'grid',
            ],
            [
                'slug' => 'photography',
                'name_fr' => 'Photographie & Vidéo',
                'name_ar' => 'تصوير وفيديو',
                'icon' => 'camera',
            ],
            [
                'slug' => 'catering',
                'name_fr' => 'Traiteur',
                'name_ar' => 'طعام وتقديم',
                'icon' => 'utensils',
            ],
            [
                'slug' => 'decoration',
                'name_fr' => 'Décoration',
                'name_ar' => 'ديكور',
                'icon' => 'flower',
            ],
            [
                'slug' => 'cakes',
                'name_fr' => 'Gâteaux de mariage',
                'name_ar' => 'كعك الزفاف',
                'icon' => 'cake',
            ],
            [
                'slug' => 'jewelry',
                'name_fr' => 'Bijoux',
                'name_ar' => 'مجوهرات',
                'icon' => 'gem',
            ],
            [
                'slug' => 'makeup',
                'name_fr' => 'Maquillage & Coiffure',
                'name_ar' => 'مكياج وتسريحات',
                'icon' => 'sparkles',
            ],
            [
                'slug' => 'sweets',
                'name_fr' => 'Pâtisserie & Confiserie',
                'name_ar' => 'حلويات تقليدية',
                'icon' => 'cookie',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
