const { saveBlog } = require('../controllers/blogs'); // Replace 'your-module' with the actual module path

describe('saveBlog', () => {
    it('should handle a valid request', async () => {
        const req = {
            body: {
                title: 'Test Title',
                description: 'Test Description',
                category: [1, 2], // Example category IDs
            },
            file: {
                filename: 'test_image.jpg',
            },
        };
        const res = {
            status: jest.fn(),
            redirect: jest.fn(),
            flash: jest.fn(),
        };

        await saveBlog(req, res);

        // Your assertions here to check the behavior
        expect(res.status).toBe(200); // Adjust the status code as needed
        expect(res.redirect).toHaveBeenCalledWith('/');
        // Add more assertions as needed
    });

    it('should handle an invalid request', async () => {
        const req = {
            body: {
                title: 'Invalid Title', // Missing description and category
            },
            file: {
                filename: 'test_image.jpg',
            },
        };
        const res = {
            status: jest.fn(),
            redirect: jest.fn(),
            flash: jest.fn(),
        };

        await saveBlog(req, res);

        // Your assertions here to check the behavior
        expect(res.status).toHaveBeenCalledWith(502); // Adjust the status code as needed
        expect(res.redirect).toHaveBeenCalledWith('/blog');
        // Add more assertions as needed
    });

  // Add more test cases for different scenarios as needed
});