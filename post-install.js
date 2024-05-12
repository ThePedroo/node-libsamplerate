import fs from 'node:fs'
import os from 'node:os'
import { spawn } from 'node:child_process'

(async () => {
  console.log('[node-libsamplerate] Welcome. This script will prepare the project for use.')

  console.log('[node-libsamplerate] Checking if your machine has node-gyp, cmake and make installed')

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

  await new Promise((resolve) => {
    const cmake = spawn('cmake', [ '--version' ], { shell: true })

    cmake.on('close', (code) => {
      if (code === 0) resolve()
      else {
        console.error('[node-libsamplerate] cmake not found. In this case, it existed with non-0 code.')

        process.exit(1)
      }
    })

    cmake.on('error', (err) => {
      console.error(`[node-libsamplerate] cmake not found. In this case, it failed to run: ${err.message}`)

      process.exit(1)
    })
  })

  console.log('[node-libsamplerate] cmake found')

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

  console.log('[node-libsamplerate] OK. Everything good. Checking whether or not libsamplerate has been built')

  const buildExists = fs.existsSync('deps/libsamplerate/build')

  if (!buildExists) {
    console.log('[node-libsamplerate] Build directory not found. Building libsamplerate...')

    console.log('[node-libsamplerate] Creating build directory...')

    try {
      fs.mkdirSync('deps/libsamplerate/build', { recursive: true })
    } catch (err) {
      console.error(`[node-libsamplerate] Error creating build directory: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Build directory created. Entering in it...')

    try {
      process.chdir('deps/libsamplerate/build')
    } catch (err) {
      console.error(`[node-libsamplerate] Error entering build directory: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Entered in build directory. Running cmake...')

    await new Promise((resolve,) => {
      const cmake = spawn('cmake', [ '-DCMAKE_BUILD_TYPE=Release', '..' ], { shell: true })

      cmake.stdout.on('data', (data) => console.log(`[node-libsamplerate:cmake] ${data.toString()}`))
      cmake.stderr.on('data', (data) => console.error(`[node-libsamplerate:cmake] ${data.toString()}`))

      cmake.on('close', (code) => {
        if (code === 0) resolve()
        else {
          console.error(`[node-libsamplerate:cmake] cmake exited with code ${code}`)

          process.exit(1)
        }
      })
    })

    console.log('[node-libsamplerate] cmake ran successfully. Running make...')

    await new Promise((resolve) => {
      const make = spawn('make', [ `-j${os.cpus().length}` ], { shell: true })

      make.stdout.on('data', (data) => console.log(`[node-libsamplerate:make] ${data.toString()}`))
      make.stderr.on('data', (data) => console.error(`[node-libsamplerate:make] ${data.toString()}`))

      make.on('close', (code) => {
        if (code >= 0) resolve()
        else {
          console.error(`[node-libsamplerate:make] make exited with code ${code}`)

          process.exit(1)
        }
      })
    })

    console.log('[node-libsamplerate] make ran successfully. Returning to project root...')

    try {
      process.chdir('../../..')
    } catch (err) {
      console.error(`[node-libsamplerate] Error returning to project root: ${err.message}`)

      process.exit(1)
    }

    console.log('[node-libsamplerate] Returned to project root. Building the binding with node-gyp...')
  } else {
    console.log('[node-libsamplerate] Build directory found. Supossing libsamplerate has been already built somehow. Building the binding with node-gyp...')
  }

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
