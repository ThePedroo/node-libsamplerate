{
  "targets": [
    {
      "target_name": "liblibsamplerate",
      "sources": [
        "src/binding.cc",
        "src/node-libsamplerate.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "../deps/libsamplerate/src"
      ],
      "libraries": [
        "-Wl,-rpath, ../deps/libsamplerate/build/libsamplerate.a",
      ],
      "cflags_cc!": [ "-Wall", "-Wextra", "-Wpedantic", "-fno-exceptions" ],
      "defines": [ "NAPI_CPP_EXCEPTIONS" ]
    }
  ]
}
