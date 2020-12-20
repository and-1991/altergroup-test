<template>
  <div class="page">
    <div class="page__rooms">
      <div class="content">
        <div class="content__header" :stateStore="stateStore">
          {{ pageName }}
        </div>
        <div class="filter-bar">
          <div class="filter">
            <div class="filter-label" style="margin-left: 10px">Комнаты</div>
            <v-btn-toggle v-model="state.toggle" group>
              <v-btn value="XS">S</v-btn>
              <v-btn value="1k">1к</v-btn>
              <v-btn value="2k">2к</v-btn>
              <v-btn value="3k">3к</v-btn>
            </v-btn-toggle>
          </div>
          <div class="filter">
            <div class="filter-label">Этаж</div>
            <div class="filter-inputs">
              <v-text-field
                solo
                v-model.number="state.floor[0]"
                maxLength="2"
              />
              <div class="dash">-</div>
              <v-text-field
                solo
                v-model.number="state.floor[1]"
                maxLength="2"
              />
            </div>
            <v-range-slider
              v-model="state.floor"
              max="99"
              min="1"
              track-color="green"
              color="green"
            ></v-range-slider>
          </div>
          <div class="filter">
            <div class="filter-label">Площадь, м<sup>2</sup></div>
            <div class="filter-inputs">
              <v-text-field
                solo
                v-model.number="state.square[0]"
                maxLength="3"
              />
              <div class="dash">-</div>
              <v-text-field
                solo
                v-model.number="state.square[1]"
                maxLength="3"
              />
            </div>
            <v-range-slider
              v-model="state.square"
              max="999"
              min="1"
              track-color="green"
              color="green"
            ></v-range-slider>
          </div>
          <div class="filter">
            <div class="filter-label">Стоимость, млн.р.</div>
            <div class="filter-inputs">
              <v-text-field
                solo
                v-model.number="state.price[0]"
                maxLength="4"
              />
              <div class="dash">-</div>
              <v-text-field
                solo
                v-model.number="state.price[1]"
                maxLength="4"
              />
            </div>
            <v-range-slider
              v-model="state.price"
              max="99"
              min="1"
              track-color="green"
              color="green"
            ></v-range-slider>
          </div>
          <div class="filter filter-actions">
            <v-btn color="green" dark @click="applyFilters">
              Применить
            </v-btn>
            <div class="filter-reset" @click="restFilters">
              Сбросить фильтр
            </div>
          </div>
        </div>
        <div class="list-cards">
          <div
            class="card"
            v-for="room in stateStore"
            :key="room.id"
            @mouseenter="setShow(room.id, true)"
            @mouseleave="setShow(room.id, false)"
          >
            <div class="card__header">
              <div>{{ room.floor }} этаж</div>
              <div>
                {{ room.rooms }} {{ roomEnding(room.rooms) }}
                <span class="dash">-</span> {{ room.square }}<sup>2</sup>
              </div>
            </div>
            <div class="card__body">
              <div class="card__body__header">
                <div>{{ room.number }}</div>
              </div>
              <div class="card__body__image" />
            </div>
            <div class="card__footer">
              <div class="card__footer__price">{{ price(room.price) }}p.</div>
              <div class="card__footer__per-meter">
                {{ pricePerMeter(room.price, room.square) }} за м<sup>2</sup>
              </div>
              <transition name="fade">
                <v-btn v-if="getShow(room.id)" color="green" dark
                  >Подробнее</v-btn
                >
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import RoomsModule from "@/store/modules/rooms";
import { roomEnding } from "@/utils";
import { Rooms as Room } from "@/interface";
import { data } from "@/store/modules/mock-data";

@Component({})
export default class Rooms extends Vue {
  pageName = "Lorem ipsum dolor sit";
  roomsStore = getModule(RoomsModule);
  roomEnding = roomEnding;
  showElem: { id: number; show: boolean }[] = this.showElement;

  get stateStore() {
    return this.roomsStore.rooms;
  }

  mounted() {
    this.roomsStore.loadData(data);
  }

  state = {
    toggle: "",
    floor: [1, 99],
    square: [1, 999],
    price: [1, 99]
  };

  restFilters() {
    this.state = {
      toggle: "",
      floor: [1, 99],
      square: [1, 999],
      price: [1, 99]
    };
    this.roomsStore.restRooms(data);
  }

  get showElement() {
    return this.roomsStore.rooms.map((el: Room) => ({
      id: el.id,
      show: false
    }));
  }

  setShow(id: number, value: boolean): any {
    this.showElem = this.showElem.map((el: any) => {
      return el.id === id
        ? {
            ...el,
            show: value
          }
        : {
            ...el
          };
    });
  }

  getShow(id: number): boolean {
    const show = this.showElem.find((el: any) => el.id === id);
    if (show === undefined) {
      return false;
    }
    return show.show;
  }

  price(num: any): any {
    if (num !== null) {
      return num
        .toString()
        .split("")
        .reverse()
        .join("")
        .match(/.{1,3}/g)
        .reverse()
        .join(" ");
    }
    return "0";
  }

  pricePerMeter(price: number, square: number): string {
    const perMeter = Math.floor(price / square);
    return this.price(perMeter);
  }

  applyFilters() {
    this.roomsStore.filterRooms(this.state);
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/base/colors";
.page {
  background: $darkslategray;
  width: 100%;
  height: 100%;
  padding: 80px;
  &__rooms {
    background: $white;
    border-radius: 10px;
    padding: 30px;
    width: 100%;
    min-height: 100%;
    display: grid;
  }
}

.content {
  width: 100%;
  background: $gray;
  border-radius: 10px;
  &__header {
    margin-top: 38px;
    display: flex;
    justify-content: center;
    font-weight: 400;
    font-size: 34px;
    line-height: 60px;
    text-transform: uppercase;
  }
}

.filter-bar {
  margin: 35px 0;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(5, 15%);
  grid-column-gap: 5%;
  grid-template-rows: 1fr;
}

.list-cards {
  margin: auto;
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(auto-fill, 22.5%);
  justify-content: center;
  margin-bottom: 30px;
  .card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 365px;
    background: $white;
    padding: 10px;
    box-shadow: 0 5px 20px rgba(86, 86, 86, 0.05);
    &__header {
      margin: 0 5px;
      font-size: 12px;
      line-height: 28px;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }
    &__body {
      transition: all 0.2s;
      height: 100%;
      border: 1px solid #ebebeb;
      box-sizing: border-box;
      border-radius: 5px;
      overflow: hidden;
      &__header {
        display: flex;
        justify-content: flex-end;
        height: 38px;
        > div {
          font-weight: 700;
          font-size: 14px;
          line-height: 28px;
          padding: 0 10px;
          display: inline-flex;
          height: 38px;
          border: 1px solid #ebebeb;
          align-items: center;
        }
      }
      &__image {
        height: calc(100% - 40px);
        background-image: url("../assets/img/plan.svg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
    &__footer {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      > div {
        text-align: right;
        font-weight: 700;
        line-height: 28px;
      }
      &__price {
        color: $darkslategray;
        font-size: 20px;
      }
      &__per-meter {
        color: $darkgray;
        font-size: 12px;
      }
    }
    &:hover {
      box-shadow: 0 5px 20px rgba(86, 86, 86, 0.25);
    }
  }
}

.dash {
  margin: 0 10px;
  color: $darkgray;
}

.show-more {
  color: $white;
}

.filter-inputs {
  display: flex;
}

.filter-reset {
  font-weight: 700;
  font-size: 10px;
  line-height: 28px;
  text-transform: uppercase;
  color: $darkslategray;
  cursor: pointer;
}

.filter {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  .filter-label {
    font-size: 12px;
    font-weight: bold;
    line-height: 28px;
    text-transform: uppercase;
  }
}

.filter-actions {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > button {
    width: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.v-input__slider {
  margin-top: -20px;
}
</style>
