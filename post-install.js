import os from 'node:os'
import { spawn } from 'node:child_process'

(async () => {
  console.log('[node-libsamplerate] Welcome. This script will prepare the project for use.')

  if (process.platform === 'win32') 
    console.log('[node-libsamplerate] Windows detected. Checking if your machine has node-gyp and nmake installed')
  else
    console.log('[node-libsamplerate] Checking if your machine has node-gyp and make installed')

  await new Promise((resolve) => {
    const nodeGyp = spawn('node-gyp', [ '--version' ], { shell: true })

    nodeGyp.on('close', (code) => {
      if (code === 0) resolve()
      else {
        console.error('[node-libsamplerate] node-gyp not found. In this case, it existed with non-0 code.')

        process.exit(1)
      }
    })

    nodeGyp.on('error', (err) => {
      console.error(`[node-libsamplerate] node-gyp not found. In this case, it failed to run: ${err.message}`)

      process.exit(1)
    })
  })

  console.log('[node-libsamplerate] node-gyp found')

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const nmake = spawn('nmake', [ '/?' ], { shell: true })

      nmake.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error('[node-libsamplerate] nmake not found. In this case, it existed with non-0 code.')

          process.exit(1)
        }
      })

      nmake.on('error', (err) => {
        console.error(`[node-libsamplerate] nmake not found. In this case, it failed to run: ${err.message}`)

        process.exit(1)
      })
    })

    console.log('[node-libsamplerate] nmake found')
  } else {
    await new Promise((resolve) => {
      const make = spawn('make', [ '--version' ], { shell: true })

      make.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error('[node-libsamplerate] make not found. In this case, it existed with non-0 code.')

          process.exit(1)
        }
      })

      make.on('error', (err) => {
        console.error(`[node-libsamplerate] make not found. In this case, it failed to run: ${err.message}`)

        process.exit(1)
      })
    })

    console.log('[node-libsamplerate] make found')
  }

  console.log('[node-libsamplerate] OK. Everything good. Entering libsamplerate directory.')

  try {
    process.chdir('deps/libsamplerate')
  } catch (err) {
    console.error(`[node-libsamplerate] Error entering libsamplerate directory: ${err.message}`)

    process.exit(1)
  }

  console.log(`[node-libsamplerate] Entered libsamplerate directory. Building the library with ${process.platform === 'win32' ? 'nmake' : 'make'}...`)

  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const nmake = spawn('nmake', [ `/f`, `Makefile.win`, `CFG=release` ], { shell: true })

      nmake.stdout.on('data', (data) => console.log(`[node-libsamplerate:nmake] ${data.toString()}`))
      nmake.stderr.on('data', (data) => console.error(`[node-libsamplerate:nmake] ${data.toString()}`))

      nmake.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error(`[node-libsamplerate:nmake] nmake exited with code ${code}`)

          process.exit(1)
        }
      })
    })
  } else {
    await new Promise((resolve) => {
      const make = spawn('make', [ `-j${os.cpus().length}` ], { shell: true })

      make.stdout.on('data', (data) => console.log(`[node-libsamplerate:make] ${data.toString()}`))
      make.stderr.on('data', (data) => console.error(`[node-libsamplerate:make] ${data.toString()}`))

      make.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error(`[node-libsamplerate:make] make exited with code ${code}`)

          process.exit(1)
        }
      })
    })
  }

  console.log(`[node-libsamplerate] ${process.platform === 'win32' ? 'nmake' : 'make'} ran successfully. Returning to project root...`)

  try {
    process.chdir('../..')
  } catch (err) {
    console.error(`[node-libsamplerate] Error returning to project root: ${err.message}`)

    process.exit(1)
  }

  console.log('[node-libsamplerate] Returned to project root. Building the binding with node-gyp...')

  await new Promise((resolve) => {
    const nodeGyp = spawn('node-gyp', [ 'configure', 'build' ], { shell: true })

    nodeGyp.stdout.on('data', (data) => console.log(`[node-libsamplerate:node-gyp] ${data.toString()}`))
    nodeGyp.stderr.on('data', (data) => console.error(`[node-libsamplerate:node-gyp] ${data.toString()}`))

    nodeGyp.on('close', (code) => {
      if (code === 0) resolve()
      else {
        console.error(`[node-libsamplerate:node-gyp] node-gyp exited with code ${code}`)

        process.exit(1)
      }
    })
  })

  console.log('[node-libsamplerate] node-gyp ran successfully. Welcome.')
})()
