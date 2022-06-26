import { move, walk } from 'https://deno.land/std@0.145.0/fs/mod.ts';
import {
    basename,
    dirname,
    join,
    resolve
} from 'https://deno.land/std@0.145.0/path/mod.ts';
import InputLoop from 'https://deno.land/x/input@2.0.3/index.ts';

//------------------------------------------------------------------------------
// ファイル名を変更する
//------------------------------------------------------------------------------
async function rename(path: string) {
    const name = basename(path);
    const newName = name.replace(/\.jpeg$/, '.jpg').replace(/\.jpe$/, '.jpg');
    const newPath = join(dirname(path), newName);
    const stat = await Deno.lstat(path);

    if (stat.isFile && newName != name) {
        console.log(`${path}\n-> ${newName}`);
        try {
            await move(path, newPath);
        }
        catch (e) {
            throw new Error(`ファイル名の変更に失敗しました。: ${e.message}`);
        }
    }
}

//------------------------------------------------------------------------------
// メイン
//------------------------------------------------------------------------------
export async function main(args: string[]) {
    if (args.length === 0) {
        console.error('処理対象のファイルまたはフォルダを指定してください。');
        Deno.exit(1);
    }

    await Promise.all(args.map(async arg => {
        const absolutePath = resolve(arg);
        const stat = await Deno.lstat(absolutePath);

        if (stat.isDirectory) {
            console.log(`処理対象フォルダ: ${absolutePath}`);
            for await (const entry of walk(absolutePath)) {
                await rename(entry.path).catch(e => console.error(e));
            }
        }
        else if (stat.isFile) {
            console.log(`処理対象ファイル: ${absolutePath}`);
            await rename(absolutePath).catch(e => console.error(e));
        }
    }));

    console.log('完了');

    if (Deno.build.os === 'windows') {
        const input = new InputLoop();
        await input.wait();
    }
}

if (import.meta.main) {
    main(Deno.args);
}
