/**
 * Represents a user in the system.
 */
type User = {
    id: number;
    name: string;
    email: string;
};

// Fake in-memory database
const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }
];

/**
 * Retrieves all users from the database.
 * @returns {User[]}
 */
export const findAllUsers = (): User[] => [...users];

/**
 * Retrieves a user by their ID from the database.
 * @param {number} id - The ID of the user to retrieve.
 * @returns {User[]}
 */
export const findUserById = (id: number): User | undefined => users.find(user => user.id === id);
