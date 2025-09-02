<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lecturer;

class LecturerSeeder extends Seeder
{
    public function run(): void
    {
        $lecturers = [
            ['lecturer_id' => 'L001', 'name' => 'Sarah Nyarko', 'email' => 'snyarko@presentx.test'],
            ['lecturer_id' => 'L002', 'name' => 'Dr Sarah Okine', 'email' => 'sokine@presentx.test'],
            ['lecturer_id' => 'L003', 'name' => 'Alexander J. Taylor', 'email' => 'ajtaylor@presentx.test'],
            ['lecturer_id' => 'L004', 'name' => 'Michael Benson Adu', 'email' => 'mbadu@presentx.test'],
            ['lecturer_id' => 'L005', 'name' => 'Eugene M. Akoto', 'email' => 'emakoto@presentx.test'],
            ['lecturer_id' => 'L006', 'name' => 'Alphonse Bayor', 'email' => 'abayor@presentx.test'],
            ['lecturer_id' => 'L007', 'name' => 'Gideon Bentum', 'email' => 'gbentum@presentx.test'],
            ['lecturer_id' => 'L008', 'name' => 'Samuel B. Antwi', 'email' => 'santwi@presentx.test'],
            ['lecturer_id' => 'L009', 'name' => 'David Ampadu', 'email' => 'dampadu@presentx.test'],
            ['lecturer_id' => 'L010', 'name' => 'Dorenda Nikoi Kotei', 'email' => 'dkotei@presentx.test'],
            ['lecturer_id' => 'L011', 'name' => 'Jerry O. Ansah', 'email' => 'jansah@presentx.test'],
            ['lecturer_id' => 'L012', 'name' => 'Agnes Osei-Serwaa', 'email' => 'aosei@presentx.test'],
            ['lecturer_id' => 'L013', 'name' => 'Felix Nti-Koranteng', 'email' => 'fnti@presentx.test'],
            ['lecturer_id' => 'L014', 'name' => 'Kaisu Mumuni', 'email' => 'kmumuni@presentx.test'],
            ['lecturer_id' => 'L015', 'name' => 'Michael Tuffour', 'email' => 'mtuffour@presentx.test'],
            ['lecturer_id' => 'L016', 'name' => 'Senyo Appoh', 'email' => 'sappoh@presentx.test'],
            ['lecturer_id' => 'L017', 'name' => 'Edward S. Younge', 'email' => 'eyounge@presentx.test'],
            ['lecturer_id' => 'L018', 'name' => 'Ferdinand Hiagbe', 'email' => 'fhiagbe@presentx.test'],
            ['lecturer_id' => 'L019', 'name' => 'Diana Antwi', 'email' => 'dantwi@presentx.test'],
            ['lecturer_id' => 'L020', 'name' => 'Godwin Gaduga Esq', 'email' => 'ggaduga@presentx.test'],
            ['lecturer_id' => 'L021', 'name' => 'Dominic Osei-Boakye', 'email' => 'dosei@presentx.test'],
            ['lecturer_id' => 'L022', 'name' => 'Abdul Mumin Seidu', 'email' => 'amseidu@presentx.test'],
            ['lecturer_id' => 'L023', 'name' => 'Desmond Sylvester Axedzi', 'email' => 'daxedzi@presentx.test'],
            ['lecturer_id' => 'L024', 'name' => 'Hamza Wahab Abdul Kaka (PhD)', 'email' => 'hkaka@presentx.test'],
            ['lecturer_id' => 'L025', 'name' => 'Mark Andoh', 'email' => 'mandoh@presentx.test'],
            ['lecturer_id' => 'L026', 'name' => 'Ofei E. Fianko', 'email' => 'ofianko@presentx.test'],
            ['lecturer_id' => 'L027', 'name' => 'Dr Razak Opoku', 'email' => 'ropoku@presentx.test'],
            ['lecturer_id' => 'L028', 'name' => 'Arnold Okyere Yaboah', 'email' => 'ayaboah@presentx.test'],
            ['lecturer_id' => 'L029', 'name' => 'Chris Andoh', 'email' => 'candoh@presentx.test'],
            ['lecturer_id' => 'L030', 'name' => 'Francis Avevor', 'email' => 'favevor@presentx.test'],
            ['lecturer_id' => 'L031', 'name' => 'Seth Oppong', 'email' => 'soppong@presentx.test'],
            ['lecturer_id' => 'L032', 'name' => 'Samuel Narh Dorhetso', 'email' => 'sdorhetso@presentx.test'],
            ['lecturer_id' => 'L033', 'name' => 'Nicholas Owusu-Debrah', 'email' => 'nowusu@presentx.test'],
            ['lecturer_id' => 'L034', 'name' => 'Ernest Acheapong', 'email' => 'eacheapong@presentx.test'],
            ['lecturer_id' => 'L035', 'name' => 'Stephen Eduafo', 'email' => 'seduafo@presentx.test'],
            ['lecturer_id' => 'L036', 'name' => 'Robert Mensah', 'email' => 'rmensah@presentx.test'],
            ['lecturer_id' => 'L037', 'name' => 'Dr Olanipekun Lateef Okikiola', 'email' => 'lokikiola@presentx.test'],
            ['lecturer_id' => 'L038', 'name' => 'Tabitha Abeka', 'email' => 'tabeka@presentx.test'],
            ['lecturer_id' => 'L039', 'name' => 'Kofi Asare', 'email' => 'kasare@presentx.test'],
            ['lecturer_id' => 'L040', 'name' => 'Mensah Marfo (PhD)', 'email' => 'mmarfo@presentx.test'],
            ['lecturer_id' => 'L041', 'name' => 'Isaac Adom Boachie', 'email' => 'iboachie@presentx.test'],
            ['lecturer_id' => 'L042', 'name' => 'Isaac Boakye', 'email' => 'iboakye@presentx.test'],
            ['lecturer_id' => 'L043', 'name' => 'Daniel Amenyeawu', 'email' => 'damenyeawu@presentx.test'],
            ['lecturer_id' => 'L044', 'name' => 'Jeffrey Aidoo', 'email' => 'jaidoo@presentx.test'],
        ];

        foreach ($lecturers as $lecturer) {
            Lecturer::create($lecturer);
        }
    }
}
