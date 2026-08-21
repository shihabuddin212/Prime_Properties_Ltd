const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database with professional screenshot properties...');

    // 1. Clear existing data
    await prisma.user.deleteMany({});
    await prisma.property.deleteMany({});
    await prisma.chatbotFAQ.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.chatMessage.deleteMany({});
    await prisma.specialOffer.deleteMany({});

    // 2. Create Admin User
    const hashedPassword = await bcrypt.hash('admin@primeproperties', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'arif@primepropertiesbd.com',
            name: 'Arif Ur Rahman',
            password: hashedPassword,
        },
    });
    console.log('Admin user seeded:', admin.email);

    // 3. Create Scenic & Professional Properties (from Screenshot)
    const properties = [
        {
            title: 'The Lighthouse',
            slug: 'the-lighthouse-bashundhara',
            description: 'The Lighthouse is an architectural masterpiece located in Block M, Bashundhara R/A. Boasting magnificent structural lines, premium double-glazed standard glass windows, automated smart-building integrations, and dedicated concierge services, it represents the epitome of high-class luxury in Dhaka.',
            location: 'Block M, Bashundhara R/A, Dhaka',
            type: 'Apartment',
            status: 'Ongoing',
            price: '5.5 Crore BDT',
            sqft: 3200,
            beds: 4,
            baths: 4,
            land: '10 Katha',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-design-42354-large.mp4',
            images: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Infinity Swimming Pool, Rooftop Fitness Lounge, 24/7 Intel Security, Standby Generator, Substation, 2 Car Parking',
            isFeatured: true,
            isSpecialOffer: true,
            published: true,
            address: 'Plot-88, Avenue 4, Block M, Bashundhara R/A, Dhaka',
            floors: 'B+G+12',
            unitsPerFloor: '1',
            launchDate: 'March 2024',
            completionDate: 'December 2027',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0982937748443!2d90.4255743759325!3d23.815110827643564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a227d%3A0xebabe0b170beec4!2sBashundhara%20R%20A%20Dhaka%201229!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'The Seasons',
            slug: 'the-seasons-bashundhara',
            description: 'Indulge in seasonal transformations with wrap-around green terraces and premium materials at The Seasons. Positioned in the highly sought-after Block I of Bashundhara R/A, this marvel features natural ventilation corridors, luxury wood floorings, European kitchen fits, and state-of-the-art backup machinery.',
            location: 'Block I, Bashundhara R/A, Dhaka',
            type: 'Apartment',
            status: 'Ongoing',
            price: '6.2 Crore BDT',
            sqft: 3600,
            beds: 4,
            baths: 5,
            land: '12 Katha',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-with-dining-table-40742-large.mp4',
            images: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800,https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Terrace Gardens, 24/7 Security Concierge, Heat Insulated Walls, Rooftop BBQ Area, Modern Lift, Fire-suppression setup',
            isFeatured: true,
            isSpecialOffer: true,
            published: true,
            address: 'Plot-142, Road-5, Block I, Bashundhara R/A, Dhaka',
            floors: 'G+9',
            unitsPerFloor: '1',
            launchDate: 'January 2024',
            completionDate: 'June 2027',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14600.320490799757!2d90.4190!3d23.8160!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a227d%3A0xebabe0b170beec4!2sBashundhara%20R%20A%20Dhaka%201229!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Emerald Heights',
            slug: 'emerald-heights-bashundhara',
            description: 'Red brick highlights and gorgeous classical structural motifs give Emerald Heights a standout presence in Block K, Bashundhara R/A. Ready for immediate handover, the building features large entry ways, premium sanitationware, imported marble lobby, and custom light-fittings.',
            location: 'Block K, Bashundhara R/A, Dhaka',
            type: 'Apartment',
            status: 'Ready',
            price: '4.8 Crore BDT',
            sqft: 2800,
            beds: 3,
            baths: 3,
            land: '8 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Marble Lobby, Fully Ready Handover, Rooftop Garden, Modern Elevator, Under-ground Water Reservoir, Guard Post',
            isFeatured: true,
            isSpecialOffer: false,
            published: true,
            address: 'Plot-91, Road-8, Block K, Bashundhara R/A, Dhaka',
            floors: 'G+8',
            unitsPerFloor: '2',
            launchDate: 'June 2021',
            completionDate: 'Completed',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14600.320490799757!2d90.4190!3d23.8160!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a227d%3A0xebabe0b170beec4!2sBashundhara%20R%20A%20Dhaka%201229!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Magnifico',
            slug: 'magnifico-gulshan',
            description: 'Located in Dhaka\'s most secure commercial and residential enclave of Gulshan, Magnifico stands as a beacon of high contemporary minimalism. Sculpted with architectural concrete, sleek metal louvers, and floor-to-ceiling glass panels, it offers breathtaking views of Gulshan Lake.',
            location: 'Gulshan, Dhaka',
            type: 'Apartment',
            status: 'Ready',
            price: '9.5 Crore BDT',
            sqft: 4500,
            beds: 4,
            baths: 5,
            land: '15 Katha',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-kitchen-interior-with-dining-table-40742-large.mp4',
            images: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Infinity Edge Pool overlooking Gulshan Lake, Fully Equipped Gym Center, High-speed Lifts, Smart Home Security, 3 Dedicated Parking spaces',
            isFeatured: true,
            isSpecialOffer: true,
            published: true,
            address: 'Plot-9, Road 44, Gulshan-2, Dhaka',
            floors: 'B+G+13',
            unitsPerFloor: '1',
            launchDate: 'October 2022',
            completionDate: 'Completed',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.155823528269!2d90.4107123!3d23.7952847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70e7e1f%3A0x6bfe76e27a718aa0!2sGulshan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Dew Drops',
            slug: 'dew-drops-bashundhara',
            description: 'Rising elegantly in Block D, Bashundhara R/A, Dew Drops showcases wooden louvers, screens, and specialized window overhangs. Ideal for modern urban professionals wanting quiet, privacy, and highly integrated solar power and water collection systems.',
            location: 'Block D, Bashundhara R/A, Dhaka',
            type: 'Apartment',
            status: 'Ongoing',
            price: '5.2 Crore BDT',
            sqft: 3100,
            beds: 4,
            baths: 4,
            land: '9 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Water Collection Systems, Solar Panels, CCTV Surveillance, Smart Locks, Community Hall, Rooftop Sitting area',
            isFeatured: true,
            isSpecialOffer: false,
            published: true,
            address: 'Plot-24, Road-11, Block D, Bashundhara R/A, Dhaka',
            floors: 'G+10',
            unitsPerFloor: '1',
            launchDate: 'November 2024',
            completionDate: 'September 2027',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14600.320490799757!2d90.4190!3d23.8160!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a227d%3A0xebabe0b170beec4!2sBashundhara%20R%20A%20Dhaka%201229!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Hillside Haven',
            slug: 'hillside-haven-khulshi',
            description: 'Experience spectacular hillside living in North Khulshi, Chattogram. Adorned with lush hanging vegetation, large balconies, and high wind resistance, this structure is tailored for maximum privacy and luxury lifestyle in the Port City.',
            location: 'North Khulshi, Chattogram',
            type: 'Apartment',
            status: 'Upcoming',
            price: '3.5 Crore BDT',
            sqft: 2400,
            beds: 3,
            baths: 3,
            land: '7 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Hillside view balcony, Fire egress design, Community Center, Central Water Reservoir, Solar power grids',
            isFeatured: true,
            isSpecialOffer: true,
            published: true,
            address: 'Road No. 2, North Khulshi R/A, Chattogram',
            floors: 'G+9',
            unitsPerFloor: '1',
            launchDate: 'September 2025',
            completionDate: 'December 2029',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.84594611425!2d91.802871!3d22.360439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd88fffff555f%3A0x6bba84ab7517c5b1!2sNorth%20Khulshi%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Avalon',
            slug: 'avalon-uttara',
            description: 'Red brick highlights and gorgeous classical structural motifs meet modern minimalism inside Avalon. Strategically located in Sector 3, Uttara, Dhaka, it offers swift airport access, nearby premium international schools, and highly secured community security settings.',
            location: 'Uttara, Dhaka',
            type: 'Apartment',
            status: 'Ready',
            price: '4.0 Crore BDT',
            sqft: 2600,
            beds: 3,
            baths: 3,
            land: '6 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Premium fittings, Fire Exit stairs, Automated Power Backup, Under-basement Parking, Rooftop Leisure Hall',
            isFeatured: true,
            isSpecialOffer: false,
            published: true,
            address: 'Plot-44, Road-12, Sector-3, Uttara, Dhaka',
            floors: 'G+8',
            unitsPerFloor: '2',
            launchDate: 'April 2022',
            completionDate: 'Completed',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.432658826543!2d90.3995874!3d23.8742874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5d05e7e3e9d%3A0x6bba84ab7517c5b1!2sSector%203%2C%20Uttara%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'La Montana',
            slug: 'la-montana-moghbazar',
            description: 'Located dynamically in Moghbazar, La Montana is built with high-quality noise cancellation windows, green landscaping, modern safety features, and proximity to major commercial sectors, schools and healthcare systems.',
            location: 'Moghbazar, Dhaka',
            type: 'Apartment',
            status: 'Ready',
            price: '3.2 Crore BDT',
            sqft: 2200,
            beds: 3,
            baths: 3,
            land: '8.5 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Acoustic Windows, Standby generator, High speed elevator, Water purification system, Rooftop Gym room',
            isFeatured: true,
            isSpecialOffer: false,
            published: true,
            address: '88/A, Wireless Colony, Moghbazar, Dhaka',
            floors: 'G+9',
            unitsPerFloor: '2',
            launchDate: 'January 2022',
            completionDate: 'Completed',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902658826543!2d90.4072874!3d23.7502874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b89a5e7e3e9d%3A0x6bba84ab7517c5b1!2sMoghbazar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        },
        {
            title: 'Fernhill',
            slug: 'fernhill-aftabnagar',
            description: 'Fernhill is a modern eco-residence situated in Aftabnagar, Dhaka. Surrounded by peaceful surroundings, wide tree-lined access roads, and featuring massive balconies decorated with woody details, it is perfect for family-focused modern living.',
            location: 'Aftabnagar, Dhaka',
            type: 'Apartment',
            status: 'Ready',
            price: '3.8 Crore BDT',
            sqft: 2500,
            beds: 3,
            baths: 3,
            land: '7.2 Katha',
            videoUrl: '',
            images: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1200,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
            floorPlans: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=800',
            amenities: 'Jogging Track, Indoor Games zone, Rooftop Lounge, Fire safety systems, Dual Elevators, 24/7 Security Guard',
            isFeatured: true,
            isSpecialOffer: false,
            published: true,
            address: 'Block-D, Road-3, Aftabnagar, Dhaka',
            floors: 'G+9',
            unitsPerFloor: '2',
            launchDate: 'June 2022',
            completionDate: 'Completed',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902658826543!2d90.4272874!3d23.7502874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd88fffff555f%3A0x6bba84ab7517c5b1!2sAftabnagar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd'
        }
    ];

    for (const property of properties) {
        await prisma.property.create({ data: property });
    }
    console.log('Sample properties seeded successfully!');

    // 4. Create Chatbot FAQs
    const faqs = [
        {
            trigger: 'price',
            response: 'Our luxury properties start from 3 Crore BDT depending on space, views, and specific location. For example, La Montana in Moghbazar is priced at 3.2 Crore BDT, while Magnifico in Gulshan goes up to 9.5 Crore BDT. Contact us at 01829-116107 for pricing details.',
        },
        {
            trigger: 'contact',
            response: 'You can contact Prime Properties BD via: \n- Telephone: 09639116107\n- Mobile & WhatsApp: 01829-116107\n- Email: arif@primepropertiesbd.com\n- Main Office: 89, Lalbagh, Water Works Rd, Dhaka 1211',
        },
        {
            trigger: 'location',
            response: 'We have projects dynamically located in Dhaka (Gulshan, Dhanmondi, Lalbagh, Mirpur, Uttara, Bashundhara, Aftabnagar) and Chattogram (North Khulshi). Let us know your preferred area so we can suggest matching properties!',
        },
        {
            trigger: 'landowner',
            response: 'We are active partners for Joint Ventures in Dhaka and Chattogram. If you own a land size of 5 Katha or more and want to partner, please call us at 01829-116107 or visit our office at Lalbagh.',
        },
        {
            trigger: 'nrb',
            response: 'We offer specialized assistance to Non-Resident Bangladeshis (NRBs). This includes secure money transfers, legal counsel, layout customization, and digitized remote documentation. WhatsApp +8801829116107 to initiate.',
        },
        {
            trigger: 'booking',
            response: 'You can request a site visit instantly through the form under any property details page, or message us your name, phone number, and preferred date right here to schedule a tour.',
        }
    ];

    for (const faq of faqs) {
        await prisma.chatbotFAQ.create({ data: faq });
    }
    console.log('Chatbot FAQs seeded successfully!');

    // 5. Seed Special Offers
    const specialOffers = [
        {
            title: 'The Seasons',
            slug: 'the-seasons-bashundhara',
            location: 'Block I, Bashundhara R/A, Dhaka',
            sizeRange: '3600 sft',
            beds: '4',
            baths: '5',
            land: '12 Katha',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
            logoBadge: 'THE SEASONS',
        },
        {
            title: 'Magnifico',
            slug: 'magnifico-gulshan',
            location: 'Gulshan, Dhaka',
            sizeRange: '4500 sft',
            beds: '4',
            baths: '5',
            land: '15 Katha',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
            logoBadge: 'MAGNIFICO',
        },
        {
            title: 'Hillside Haven',
            slug: 'hillside-haven-khulshi',
            location: 'North Khulshi, Chattogram',
            sizeRange: '2400 sft',
            beds: '3',
            baths: '3',
            land: '7 Katha',
            image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=600',
            logoBadge: 'HILLSIDE HAVEN',
        },
        {
            title: 'The Lighthouse',
            slug: 'the-lighthouse-bashundhara',
            location: 'Block M, Bashundhara R/A, Dhaka',
            sizeRange: '3200 sft',
            beds: '4',
            baths: '4',
            land: '10 Katha',
            image: 'https://images.unsplash.com/photo-1545464693-f17e30d7ea2d?auto=format&fit=crop&q=80&w=600',
            logoBadge: 'THE LIGHTHOUSE',
        }
    ];

    for (const offer of specialOffers) {
        await prisma.specialOffer.create({ data: offer });
    }
    console.log('Special Offers seeded successfully!');

    // 6. Seed default Testimonials
    const testimonials = [
        {
            image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=500',
            name: 'The Chowdhury Family',
            role: 'Residents, Aqualuna Dhanmondi',
            quote: 'Buying our apartment with Prime Properties was a completely stress-free experience. The finishing and raw material quality are absolutely immaculate, and the project was handed over ahead of schedule.'
        },
        {
            image: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?auto=format&fit=crop&q=80&w=500',
            name: 'Ahmed & Family',
            role: 'NRB Homeowners, Beverly Res. Gulshan',
            quote: 'Being overseas, transparency was a huge priority. Their digital paperwork, regular video updates, and step-by-step documentation made the virtual purchasing process incredibly smooth.'
        },
        {
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=500',
            name: 'Dr. Rafid Hossain',
            role: 'Landowner Joint Venture, Banani Plot',
            quote: 'We partnered with Prime Properties for a landowner JV. Their legal department guided us through approvals seamlessly, and the structural rigidity of the finished tower exceeded our expectations.'
        },
        {
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500',
            name: 'Engr. Kamal Uddin',
            role: 'Homeowner, Moondrift Manor',
            quote: 'From luxury lobbies to rooftop gyms, every corner reflects architectural excellence. Their post-handover facility management team is also highly organized and responsive.'
        }
    ];

    for (const t of testimonials) {
        await prisma.testimonial.create({ data: t });
    }
    console.log('Testimonials seeded successfully!');

    // 7. Seed default Messages
    const sampleMessages = [
        {
            name: 'Tanvir Ahmed',
            email: 'tanvir.ahmed@gmail.com',
            subject: 'Inquiry regarding Aqualuna Apartments',
            message: 'Hello, I am interested in knowing the floor plans and payment schedule for Aqualuna Dhanmondi project. Please reach out to me.',
            isRead: false,
            type: 'Contact',
        },
        {
            name: 'Newsletter Subscriber',
            email: 'nrb.investor@outlook.com',
            subject: 'Newsletter Subscription',
            message: 'Subscribed to newsletter updates from footer section.',
            isRead: false,
            type: 'Newsletter',
        },
        {
            name: 'Nusrat Jahan',
            email: 'nusrat.jahan@yahoo.com',
            subject: 'Landowner Joint Venture Inquiry',
            message: 'We own a 10 Katha plot in Uttara Sector 5 and are looking for a trustworthy developer for a joint venture project.',
            isRead: true,
            type: 'Contact',
        },
    ];

    for (const msg of sampleMessages) {
        await prisma.message.create({ data: msg });
    }
    console.log('Sample Messages seeded successfully!');
    console.log('Seeding complete successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
