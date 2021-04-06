import { FileReader } from '../';

describe('FileReader class', () => {
	it('should require a filePath as input', () => {
		expect(() => new FileReader('')).toThrowError('must include `filesPath`');
	});

	it('should return an array of markdown files in a given directory', async () => {
		const reader = new FileReader('./src/__tests__/testBlog');

		const files = await reader.getMDownFiles();
		expect(files.length).toBe(3);
	});

	it('should parse markdown to html', async () => {
		const reader = new FileReader('./src/__tests__/testBlog');
		const fileName = '0.md';
		const file = await reader.getMDownFile(fileName, { html: true });

		expect(file.content).toContain('<');
		expect(file.content).toContain('First');
	});
});
