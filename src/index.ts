import * as matter from 'gray-matter';
import { readFile, readdir } from 'fs/promises';
import * as md from 'markdown-it';

type MDownFile = {
	frontmatter: {
		[key: string]: string | number;
	};
	filename: string;
	content: string;
};

interface GetMDownFilesOptions {
	html: boolean;
}

export class FileReaderCreationError extends Error {}

export class FileReader {
	constructor(private filesPath: string) {
		if (!filesPath) {
			throw new FileReaderCreationError('must include `filesPath`');
		}
		this.filesPath = filesPath;
	}

	private async getFiles(): Promise<string[]> {
		try {
			const dir = await readdir(this.filesPath);
			return dir;
		} catch (e) {
			throw e;
		}
	}
	private async readFile(file: string): Promise<string> {
		try {
			const contents = await readFile(this.filesPath + '/' + file, 'utf-8');
			return contents;
		} catch (e) {
			throw e;
		}
	}

	public async getMDownFiles(
		options?: GetMDownFilesOptions
	): Promise<MDownFile[]> {
		const dir = await this.getFiles();
		const files: MDownFile[] = [];
		for (let i = 0; i < dir.length; i++) {
			const data = matter.read(this.filesPath + '/' + dir[i]);
			const content =
				options && options.html
					? this.parseMarkdown(data.content)
					: data.content;
			files.push({
				content,
				filename: dir[i],
				frontmatter: data.data,
			});
		}
		return files;
	}

	private parseMarkdown(input: string): string {
		if (input) return md({ html: true }).render(input);
		else {
			throw Error('no input passed: ' + input);
		}
	}

	public async getMDownFile(f: string, options: GetMDownFilesOptions): Promise<MDownFile> {
		const fileName = f.endsWith('.md') ? f : f + '.md';
		const file = await (await this.getMDownFiles(options)).filter(f => f.filename === fileName)[0];

		return file;
	}
}

export async function useMarkdownFiles(
	filePath: string,
	html: boolean = false
): Promise<MDownFile[]> {
	return await new FileReader(filePath).getMDownFiles({ html });
}

// async function main() {
// 	// const rd = new FileReader('./blog');

// 	// const files = await rd.getMDownFiles({ html: true });

// 	const files = await useMarkdownFiles('./blog');
// 	console.log(files);
// }

// main();
