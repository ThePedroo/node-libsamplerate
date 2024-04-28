cmake_minimum_required(VERSION 3.1...3.29)
project(node-libsamplerate)

execute_process(COMMAND git submodule update --init --recursive
    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
    RESULT_VARIABLE GIT_SUBMODULE_RESULT
)

set(LIBSAMPLERATE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/deps/libsamplerate")

file(MAKE_DIRECTORY ${LIBSAMPLERATE_DIR}/build)

execute_process(COMMAND ${CMAKE_COMMAND} -E chdir ${LIBSAMPLERATE_DIR}/build ${CMAKE_COMMAND} ..)

execute_process(COMMAND ${CMAKE_COMMAND} --build ${LIBSAMPLERATE_DIR}/build)

execute_process(COMMAND make WORKING_DIRECTORY ${LIBSAMPLERATE_DIR}/build)

set(CMAKE_CXX_STANDARD 11)


file(GLOB SOURCE_FILES "src/*.cc" "src/*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

execute_process(COMMAND node -p "require('node-addon-api').include"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    OUTPUT_VARIABLE NODE_ADDON_API_DIR
    )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} libsamplerate)

include(ExternalProject)
ExternalProject_Add(src_project
    CMAKE_ARGS -D CMAKE_POSITION_INDEPENDENT_CODE=on -D CMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}

    SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/deps

    )
ExternalProject_Get_Property(src_project binary_dir)
add_library(libsamplerate UNKNOWN IMPORTED)
if(WIN32)
    set_target_properties(libsamplerate PROPERTIES
        IMPORTED_LOCATION ../deps/libsamplerate/build/samplerate.lib
    )
else()
    set_target_properties(libsamplerate PROPERTIES
        IMPORTED_LOCATION ../deps/libsamplerate/build/libsamplerate.a 
    )
endif()
add_dependencies(libsamplerate src_project)
add_dependencies(node-libsamplerate libsamplerate)
