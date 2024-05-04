CXX = g++

SRC_DIR = src
OBJ_DIR = obj

CFLAGS := -Wall -Wextra -Wpedantic
LDFLAGS := -std=c++11 -Ideps/libsamplerate/include
LFLAGS := -Ldeps/libsamplerate/build/src -lsamplerate -pthread
NODEFLAGS=-DUSING_UV_SHARED=1 -DUSING_V8_SHARED=1 -DV8_DEPRECATION_WARNINGS=1 -DOPENSSL_NO_PINSHARED -DOPENSSL_THREADS -DNAPI_CPP_EXCEPTIONS -DBUILDING_NODE_EXTENSION -lnode -lssl -lcrypto -Inode_modules/node-addon-api

SRCS = $(foreach dir,$(SRC_DIR),$(wildcard $(dir)/*.cc))
OBJS = $(patsubst %.cc,$(OBJ_DIR)/%.o,$(notdir $(SRCS)))

node_libsamplerate: $(OBJS)
	$(CXX) -o obj/libsamplerate.node -shared -pthread -Wl,--start-group $(OBJS) -Wl,--end-group -Ldeps/libsamplerate/build/src -lsamplerate
	rm obj/*.o

$(OBJ_DIR)/%.o: src/%.cc | $(OBJ_DIR)
	$(CXX) -c -fPIC $< -o $@ $(NODEFLAGS) $(LDFLAGS) $(CFLAGS) -MMD

$(OBJ_DIR):
	mkdir -p $@

.PHONY: clean

clean:
	rm -rf $(OBJ_DIR)

debug: CFLAGS += -g
debug: node_libsamplerate
