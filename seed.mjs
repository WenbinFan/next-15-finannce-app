import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { faker, th } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
)

export const categories = [
  'Housing', 'Transport', 'Health', 'Food', 'Education', 'Other'
]

async function seedUsers() {
    for (let i = 0; i < 5; i++) {
        try {
            const { data, error } = await supabase.auth.admin.createUser({
                email: faker.internet.email(),
                password: 'password',
              })
            if (error) {
                throw new Error(error)
            }

            console.log(`Created user: ${data.user.email}`)
        } catch (e) {
            console.error('Error seeding users:', e)
        }
    }
}

async function seed() {
    await seedUsers()
    let transactions = []

    const { data: { users }, error: listUsersError } = await supabase.auth.admin.listUsers()

    if (listUsersError) {
        console.error('Error listing users:', listUsersError)
        return
    }

    const userIds = users.map(user => user.id)

    for (let i = 0; i < 100; i++) {
        const created_at = faker.date.past()
        let type, category = null
        const user_id = faker.helpers.arrayElement(userIds)

        const typeBias = Math.random()

        if (typeBias < 0.80) {
            type = 'Expense'
            category = faker.helpers.arrayElement(categories)
        } else if (typeBias < 0.90) {
            type = 'Income'
        } else {
            type = faker.helpers.arrayElement(['Investment', 'Saving'])
        }

        let amount
        switch (type) {
            case 'Income':
                amount = faker.number.int({ 
                    min: 2000,
                    max: 9000
                 })
                 break
            case 'Expense':
                amount = faker.number.int({ 
                    min: 2000,
                    max: 9000
                 })
                 break   
                             case 'Income':
                amount = faker.number.int({ 
                    min: 10,
                    max: 1000
                 })
                 break
            case 'Investment':
            case 'Saving':
            amount = faker.number.int({ 
                min: 3000,
                max: 10000
                })
                break     
        }

        transactions.push({
            created_at,
            amount,
            type,
            description: faker.lorem.sentence(),
            category,
            user_id
        })
    }

    const { error } = await supabase
        .from('transactions')
        .insert(transactions)

    if (error) {
        console.error('Error seeding database:', error)
    } else {
        console.log(`Seeded ${transactions.length} transactions`)
    }
}

seed().catch(console.error)