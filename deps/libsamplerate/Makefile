SRC_DIR = src
OBJ_DIR = obj

CFLAGS := -Wall -Wextra -Wpedantic -Wshadow -DPACKAGE=\"libsamplerate\" -DVERSION=\"0.2.2\" -DENABLE_SINC_BEST_CONVERTER -DENABLE_SINC_MEDIUM_CONVERTER -DENABLE_SINC_FAST_CONVERTER
LDFLAGS := -std=c99 -O3 -Iinclude -Isrc

SRCS = $(SRC_DIR)\samplerate.c \
       $(SRC_DIR)\src_linear.c \
       $(SRC_DIR)\src_sinc.c   \
       $(SRC_DIR)\src_zoh.c

OBJS = $(OBJ_DIR)\samplerate.obj \
       $(OBJ_DIR)\src_linear.obj \
       $(OBJ_DIR)\src_sinc.obj   \
       $(OBJ_DIR)\src_zoh.obj

libsamplerate: $(OBJS)
	ar qv $(OBJ_DIR)/libsamplerate.a $(OBJS)

$(OBJ_DIR)/%.o: src/%.c | $(OBJ_DIR)
	$(CC) -c -fPIC $< -o $@ $(LDFLAGS) $(CFLAGS)

$(OBJ_DIR):
	mkdir -p $@

.PHONY: clean

clean:
	rm -rf $(OBJ_DIR)