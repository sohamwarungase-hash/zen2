/**
 * seed.js — MGS Demo Data Seeder
 *
 * Uses @supabase/supabase-js (HTTPS / port 443) instead of Prisma so it
 * works on networks that block Postgres ports 5432 and 6543.
 *
 * Run: node seed.js
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY   // service role bypasses RLS
);

// ─── Nashik GPS locations ─────────────────────────────────────────────────────
const LOCATIONS = [
    { lat: 19.9975, lng: 73.7898, area: 'CBS Chowk, Nashik Road' },
    { lat: 20.0059, lng: 73.7710, area: 'Gangapur Road near HDFC Bank' },
    { lat: 19.9891, lng: 73.7952, area: 'Panchavati, Ramkund area' },
    { lat: 20.0134, lng: 73.7801, area: 'College Road, Nashik' },
    { lat: 19.9804, lng: 73.8011, area: 'Anandwalli, Nashik East' },
    { lat: 20.0211, lng: 73.7689, area: 'Indira Nagar, Nashik' },
    { lat: 19.9920, lng: 73.7823, area: 'Sharanpur Road' },
    { lat: 20.0087, lng: 73.7913, area: 'Pathardi Phata circle' },
    { lat: 19.9843, lng: 73.7741, area: 'Mahatma Nagar, Nashik' },
    { lat: 20.0302, lng: 73.7768, area: 'Satpur Industrial Area' },
];

// ─── Users ────────────────────────────────────────────────────────────────────
const USERS = [
    {
        id: 'seed-admin-001',
        email: 'admin@mgs.com',
        name: 'MGS Admin',
        role: 'ADMIN',
        department: null,
        points: 0,
    },
    {
        id: 'seed-officer-001',
        email: 'roads@mgs.com',
        name: 'Priya Desai',
        role: 'DEPT_OFFICER',
        department: 'ROADS_AND_INFRASTRUCTURE',
        points: 0,
    },
    {
        id: 'seed-citizen-001',
        email: 'citizen@mgs.com',
        name: 'Rahul Patil',
        role: 'CITIZEN',
        department: null,
        points: 120,
    },
];

// ─── Complaint templates ──────────────────────────────────────────────────────
const COMPLAINT_TEMPLATES = [
    // ── ROAD (6) ──────────────────────────────────────────────────────────────
    {
        title: 'Large pothole on College Road near petrol pump',
        description: 'There is a very large pothole near the BPCL petrol pump on College Road. It has been there for over two weeks and has already caused two bike accidents. Vehicles are having to swerve dangerously into oncoming traffic.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 9, status: 'ESCALATED', locIdx: 3,
        slaHoursOffset: -10, isDuplicate: false, validationCount: 3,
    },
    {
        title: 'Road caving in near Ramkund bridge',
        description: 'The road surface near the Ramkund bridge is cracking and showing signs of subsidence. Deep cracks are visible along a 20-metre stretch. This is a safety hazard for pedestrians and two-wheelers alike.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 8, status: 'IN_PROGRESS', locIdx: 2,
        slaHoursOffset: 16, isDuplicate: false, validationCount: 1,
    },
    {
        title: 'Speed breaker broken at Sharanpur Road junction',
        description: 'The concrete speed breaker at the Sharanpur Road and Gangapur Road junction has partially crumbled. The exposed iron rods are puncturing tyres of vehicles passing over it.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 7, status: 'ASSIGNED', locIdx: 6,
        slaHoursOffset: 20, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Footpath tiles broken and dangerous near CBS Chowk',
        description: 'Multiple footpath tiles at CBS Chowk are cracked and jutting upwards, creating a tripping hazard especially for the elderly and children walking to the nearby school.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 5, status: 'SUBMITTED', locIdx: 0,
        slaHoursOffset: 40, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Manhole cover missing on Pathardi road',
        description: 'A manhole cover is completely missing on Pathardi Phata road. The open manhole is partially covered by a rock placed by residents but this is inadequate. Vehicles and pedestrians are at serious risk.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 10, status: 'ESCALATED', locIdx: 7,
        slaHoursOffset: -24, isDuplicate: false, validationCount: 5,
    },
    {
        title: 'Divider paint faded on Gangapur Road',
        description: 'Road divider markings on Gangapur Road between the Haveli restaurant and NMC office are completely faded and invisible at night, causing confusion and wrong-side driving.',
        category: 'ROAD', department: 'ROADS_AND_INFRASTRUCTURE',
        priority: 3, status: 'RESOLVED', locIdx: 1,
        slaHoursOffset: -48, isDuplicate: false, validationCount: 0,
    },

    // ── WATER (5) ─────────────────────────────────────────────────────────────
    {
        title: 'Water supply off for 3 days in Indira Nagar',
        description: 'Residents of Indira Nagar sector 4 have not received any water supply for the past 3 days. Multiple households are dependent on this supply with no alternative source.',
        category: 'WATER', department: 'WATER_SUPPLY',
        priority: 10, status: 'IN_PROGRESS', locIdx: 5,
        slaHoursOffset: 4, isDuplicate: false, validationCount: 8,
    },
    {
        title: 'Leaking underground pipe near Mahatma Nagar',
        description: 'A water pipe is clearly leaking underground near the main road in Mahatma Nagar. Water is bubbling up through the tarmac and causing waterlogging. The leak has worsened over the past week.',
        category: 'WATER', department: 'WATER_SUPPLY',
        priority: 8, status: 'ASSIGNED', locIdx: 8,
        slaHoursOffset: 18, isDuplicate: false, validationCount: 2,
    },
    {
        title: 'Dirty brown water from taps in Anandwalli',
        description: 'Residents of Anandwalli are receiving brown discoloured water for two days. The water smells foul and is clearly not potable. Children have complained of stomach problems.',
        category: 'WATER', department: 'WATER_SUPPLY',
        priority: 9, status: 'ESCALATED', locIdx: 4,
        slaHoursOffset: -8, isDuplicate: false, validationCount: 4,
    },
    {
        title: 'Public tap on Panchavati road running non-stop',
        description: 'A public tap at the corner of Panchavati road and Temple lane has been running continuously for over a week. Water is flowing into the drain unused — significant wastage of municipal water.',
        category: 'WATER', department: 'WATER_SUPPLY',
        priority: 4, status: 'SUBMITTED', locIdx: 2,
        slaHoursOffset: 44, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Low water pressure in Satpur area homes',
        description: 'Water pressure in Satpur Industrial Area residential blocks has been very low for a month. Upper floor residents receive no water during peak hours (7–9am and 6–8pm).',
        category: 'WATER', department: 'WATER_SUPPLY',
        priority: 6, status: 'RESOLVED', locIdx: 9,
        slaHoursOffset: -72, isDuplicate: false, validationCount: 1,
    },

    // ── GARBAGE (5) ───────────────────────────────────────────────────────────
    {
        title: 'Garbage not collected on Sharanpur Road for 5 days',
        description: 'Municipal garbage collection has not visited Sharanpur Road sector 2 for 5 days. Waste is overflowing from bins onto the road, creating foul odour and attracting stray dogs and rodents.',
        category: 'GARBAGE', department: 'SOLID_WASTE_MANAGEMENT',
        priority: 7, status: 'IN_PROGRESS', locIdx: 6,
        slaHoursOffset: 22, isDuplicate: false, validationCount: 3,
    },
    {
        title: 'Illegal dumping site near Anandwalli nullah',
        description: 'An illegal garbage dump has formed near the Anandwalli nullah. Construction debris, household waste and hospital waste are all being dumped together. The nullah risks blocking before monsoon.',
        category: 'GARBAGE', department: 'SOLID_WASTE_MANAGEMENT',
        priority: 9, status: 'SUBMITTED', locIdx: 4,
        slaHoursOffset: 5, isDuplicate: false, validationCount: 6,
    },
    {
        title: 'Overflowing dustbins at CBS Chowk bus stop',
        description: 'All three garbage bins at the CBS Chowk bus stop are full and overflowing. This is a major public area with heavy footfall and the situation is unhygienic.',
        category: 'GARBAGE', department: 'SOLID_WASTE_MANAGEMENT',
        priority: 6, status: 'ASSIGNED', locIdx: 0,
        slaHoursOffset: 46, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Plastic waste burning near Gangapur Road park',
        description: 'Someone is burning a large pile of plastic waste near Gangapur Road park every evening around 7pm. The smoke is causing respiratory issues for nearby residents. Happening for two weeks.',
        category: 'GARBAGE', department: 'SOLID_WASTE_MANAGEMENT',
        priority: 7, status: 'RESOLVED', locIdx: 1,
        slaHoursOffset: -96, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Garbage bin missing from Pathardi Phata area',
        description: 'The garbage bin near Pathardi Phata circle has been missing for over three months. Residents have no designated disposal point and are forced to leave waste on the roadside.',
        category: 'GARBAGE', department: 'SOLID_WASTE_MANAGEMENT',
        priority: 3, status: 'SUBMITTED', locIdx: 7,
        slaHoursOffset: 60, isDuplicate: false, validationCount: 0,
    },

    // ── STREETLIGHT (5) ───────────────────────────────────────────────────────
    {
        title: 'Street lights off for entire College Road stretch',
        description: 'All street lights on College Road from Nashik Road flyover to the college gate have been non-functional for six nights. Two chain snatching incidents have been reported in this period.',
        category: 'STREETLIGHT', department: 'STREET_LIGHTING',
        priority: 8, status: 'ESCALATED', locIdx: 3,
        slaHoursOffset: -12, isDuplicate: false, validationCount: 4,
    },
    {
        title: 'Streetlight pole leaning dangerously in Mahatma Nagar',
        description: 'A streetlight pole on the main road in Mahatma Nagar is leaning at a dangerous angle. The foundation has weakened, possibly due to recent digging work by the water department. Risk of collapse.',
        category: 'STREETLIGHT', department: 'STREET_LIGHTING',
        priority: 9, status: 'ASSIGNED', locIdx: 8,
        slaHoursOffset: 4, isDuplicate: false, validationCount: 2,
    },
    {
        title: 'Streetlights staying on all day in Satpur',
        description: 'Several streetlights in the Satpur area have been on continuously for a week — 24 hours a day. This is a waste of electricity. The timer or sensor appears to be faulty.',
        category: 'STREETLIGHT', department: 'STREET_LIGHTING',
        priority: 3, status: 'RESOLVED', locIdx: 9,
        slaHoursOffset: -120, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Flickering light on Panchavati lane causes accidents',
        description: 'A streetlight on Panchavati inner lane near the temple has been flickering for two weeks. The strobe effect is disorienting to drivers and has been linked to two minor vehicle incidents.',
        category: 'STREETLIGHT', department: 'STREET_LIGHTING',
        priority: 6, status: 'SUBMITTED', locIdx: 2,
        slaHoursOffset: 42, isDuplicate: false, validationCount: 1,
    },
    {
        title: 'No streetlights in Indira Nagar lane 7',
        description: 'Indira Nagar lane 7 has had no street lighting for the past month. The lane is used by school children walking home in the evenings. Parents are concerned about safety after dark.',
        category: 'STREETLIGHT', department: 'STREET_LIGHTING',
        priority: 7, status: 'IN_PROGRESS', locIdx: 5,
        slaHoursOffset: 20, isDuplicate: false, validationCount: 0,
    },

    // ── SANITATION (6) ────────────────────────────────────────────────────────
    {
        title: 'Open defecation near Anandwalli lake boundary wall',
        description: 'Open defecation is taking place along a 50-metre stretch of the Anandwalli lake boundary wall. There is no toilet facility in this area. The situation is unhygienic and degrades the lake environment.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 8, status: 'SUBMITTED', locIdx: 4,
        slaHoursOffset: 22, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Blocked drain causing flooding on CBS road',
        description: 'The storm drain on CBS Chowk road is completely blocked with plastic bags, silt and debris. Even light rain causes severe waterlogging stretching 200 metres.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 9, status: 'IN_PROGRESS', locIdx: 0,
        slaHoursOffset: 3, isDuplicate: false, validationCount: 7,
    },
    {
        title: 'Public toilet locked in Gangapur Road park',
        description: 'The public toilet at Gangapur Road park has been locked for 10 days citing maintenance. Hundreds of daily visitors have no sanitation facility. No timeline has been provided.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 5, status: 'ASSIGNED', locIdx: 1,
        slaHoursOffset: 36, isDuplicate: false, validationCount: 0,
    },
    {
        title: 'Stagnant water and mosquito breeding at Sharanpur drain',
        description: 'The open drain on Sharanpur Road has stagnant water for over a month. Mosquito larvae are clearly visible. This is a public health emergency given dengue and malaria risk in monsoon season.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 8, status: 'ESCALATED', locIdx: 6,
        slaHoursOffset: -6, isDuplicate: false, validationCount: 5,
    },
    {
        title: 'Sewage overflow on Pathardi Phata main road',
        description: 'Raw sewage is overflowing from a cracked sewer line onto Pathardi Phata road and flowing into a nearby residential area. The stench is unbearable. Elderly residents and young children are severely impacted.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 10, status: 'ESCALATED', locIdx: 7,
        slaHoursOffset: -18, isDuplicate: false, validationCount: 9,
    },
    {
        title: 'Dustbin near Satpur school damaged and unusable',
        description: 'The municipal dustbin outside the primary school in Satpur is damaged — both the bin and the supporting structure are broken. Students and teachers have no proper waste disposal and the area is littered.',
        category: 'SANITATION', department: 'SANITATION',
        priority: 4, status: 'RESOLVED', locIdx: 9,
        slaHoursOffset: -96, isDuplicate: false, validationCount: 0,
    },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildSlaDeadline(offsetHours) {
    return new Date(Date.now() + offsetHours * 60 * 60 * 1000).toISOString();
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🌱 Starting MGS database seed...\n');

    // ── 1. Upsert users ───────────────────────────────────────────────────────
    for (const u of USERS) {
        const { error } = await supabase
            .from('User')
            .upsert(
                {
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    role: u.role,
                    department: u.department,
                    points: u.points,
                    createdAt: new Date().toISOString(),
                },
                { onConflict: 'id' }
            );

        if (error) {
            throw new Error(`Failed to upsert user ${u.email}: ${error.message}`);
        }
        console.log(`  ✅ User upserted: ${u.email} (${u.role})`);
    }

    // ── 2. Upsert complaints ──────────────────────────────────────────────────
    let count = 0;
    for (const [i, t] of COMPLAINT_TEMPLATES.entries()) {
        const loc = LOCATIONS[t.locIdx];
        const cId = `seed-complaint-${String(i + 1).padStart(3, '0')}`;
        const now = new Date().toISOString();

        const { error } = await supabase
            .from('Complaint')
            .upsert(
                {
                    id: cId,
                    title: t.title,
                    description: t.description,
                    category: t.category,
                    department: t.department,
                    priority: t.priority,
                    status: t.status,
                    latitude: loc.lat,
                    longitude: loc.lng,
                    address: loc.area,
                    slaDeadline: buildSlaDeadline(t.slaHoursOffset),
                    isDuplicate: t.isDuplicate,
                    validationCount: t.validationCount,
                    userId: 'seed-citizen-001',
                    createdAt: now,
                    updatedAt: now,
                },
                { onConflict: 'id' }
            );

        if (error) {
            console.error(`  ❌ Failed complaint #${i + 1}: ${error.message}`);
            continue;   // keep going for the rest
        }

        count++;
        console.log(`  ✅ Complaint #${count}: [${t.category}] ${t.title.substring(0, 50)}...`);
    }

    console.log(`\n🎉 Seed complete: 3 users + ${count} / ${COMPLAINT_TEMPLATES.length} complaints created/updated.`);
}

main().catch((e) => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
});
