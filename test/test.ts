import { exists } from 'https://deno.land/std@0.145.0/fs/mod.ts';
import { join } from 'https://deno.land/std@0.145.0/path/mod.ts';
import { assert } from 'https://deno.land/std@0.145.0/testing/asserts.ts';
import { main } from '../main.ts';

Deno.test('main', async () => {
    const files = [
        {
            dir: ['a.jpg'],
            name: 'x.jpg',
            renamed: 'x.jpg'
        },
        {
            dir: ['a.jpg', 'b.jpeg'],
            name: 'y.jpeg',
            renamed: 'y.jpg'
        },
        {
            dir: ['a.jpg', 'b.jpeg', 'c.jpe'],
            name: 'z.jpe',
            renamed: 'z.jpg'
        }
    ];

    // テンポラリディレクトリを作成
    const tempDir = await Deno.makeTempDir();

    await Promise.all(files.map(async file => {
        const dirPath = join(tempDir, ...file.dir);
        const filePath = join(dirPath, file.name);
        const renamedFilePath = join(dirPath, file.renamed);

        // サブディレクトリとファイルを作成
        await Deno.mkdir(dirPath, { recursive: true });
        (await Deno.create(filePath)).close();

        // リネーム前のファイルが存在することを確認
        assert(await exists(filePath));

        // テンポラリディレクトリに対して実行
        await main([tempDir]);

        // リネーム後のファイルが存在することを確認
        assert(await exists(renamedFilePath));
    }));

    // 作成したテンポラリディレクトリを削除
    await Deno.remove(tempDir, { recursive: true });
});
