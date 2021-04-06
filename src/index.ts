import * as matter from 'gray-matter';
import { readFile, readdir } from 'fs/promises';
import * as md from 'markdown-it';

type MDownFile = {
	frontmatter: {
		[key: string]: string | number;
	};
	content: string;
};

interface GetMDownFilesOptions {
	html: boolean;
}

class FileReader {
	constructor(private filesPath: string) {
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
}

async function main() {
	const rd = new FileReader('./blog');

	const files = await rd.getMDownFiles({ html: true });

	console.log(files);
}

main();
