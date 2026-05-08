
export class DataGenerator {

    private static readonly firstNames = [
        'Aryan', 'Priya', 'Rahul', 'Neha', 'Vikram', 'Anjali',
        'Karan', 'Meera', 'Rohan', 'Diya', 'Arjun', 'Sneha',
        'Kabir', 'Riya', 'Aditya', 'Pooja', 'Siddharth', 'Tanya',
    ];

    private static readonly lastNames = [
        'Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta',
        'Mehra', 'Joshi', 'Kapoor', 'Malhotra', 'Reddy', 'Nair',
        'Iyer', 'Bose', 'Chopra', 'Rao', 'Saxena', 'Jain',
    ];

    private constructor() { }


    public static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    public static randomString(length: number = 8): string {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    public static randomFirstName(): string {
        return this.firstNames[this.randomInt(0, this.firstNames.length - 1)]!;
    }


    public static randomLastName(): string {
        return this.lastNames[this.randomInt(0, this.lastNames.length - 1)]!;
    }


    public static randomEmail(): string {
        const random = this.randomString(6);
        const timestamp = Date.now();
        return `sdet.${random}.${timestamp}@example.com`;
    }


    public static emailFromName(firstName: string, lastName: string): string {
        const safe = (s: string) => s.toLowerCase().replace(/\s+/g, '');
        return `${safe(firstName)}.${safe(lastName)}.${Date.now()}@example.com`;
    }

    
    public static randomPassword(): string {
        return `Pass@${this.randomInt(1000, 9999)}${this.randomString(4)}`;
    }

    public static randomUser(): {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    } {
        const firstName = this.randomFirstName();
        const lastName = this.randomLastName();
        return {
            firstName,
            lastName,
            email: this.emailFromName(firstName, lastName),
            password: this.randomPassword(),
        };
    }
}