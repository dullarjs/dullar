<template>
  <div class="field-view">
    <div id="container">
      <ul>
        <li>
          <span class="title">Basic usage</span>
          <q-field label="Label" v-model="basicUsage" placeholder="Text"></q-field>
        </li>
        <li>
          <span class="title">Types</span>
          <q-field
            v-model="phoneNumber"
            label="Phone"
            type="tel"
            min="3"
            max="10"
            placeholder="phone number"
            pattern="[0-9]*"
          ></q-field>
          <q-field
            v-model="password"
            label="Password"
            type="password"
            placeholder="password"
          ></q-field>
          <q-field
            v-model="text"
            label="Text"
            type="text"
            placeholder="text"
          ></q-field>
        </li>
        <li>
          <span class="title">Readonly</span>
          <q-field
            v-model="readonly"
            label="ID"
            type="text"
            readonly
          ></q-field>
        </li>
        <li>
          <span class="title">
            Encrypted
            <i class="hidden-value">{{encryptedValue}}</i>
          </span>
          <q-field
            v-model="encryptedValue"
            label="Encrypted"
            type="text"
            :encrypted="true"
            ref="encrypted"
          ></q-field>
        </li>
        <li>
          <span class="title">Disabled</span>
          <q-field
            v-model="disabled"
            label="Keyword"
            type="text"
            :disabled="true"
          ></q-field>
        </li>
        <li>
          <span class="title">Clear Icon</span>
          <q-field
            class="clear-icon"
            v-model="clear"
            label="Clear"
            type="text"
            :clearable="true"
          ></q-field>
        </li>
        <li>
          <span class="title">Textarea</span>
          <q-field
            v-model="textarea"
            label="Textarea"
            type="textarea"
            maxlength="50"
            :showTextareaCounter="true"
            :clearable="true"
          ></q-field>
        </li>
        <li>
          <span class="title">Column display</span>
          <q-field v-model="customLable" display="column" placeholder="上面的label是我的">
            <template #label>
              <span class="custom-label">Column display</span>
            </template>
          </q-field>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import VueGgy from "../../src/component/VueGgy";
export default class Field extends Vue {
  public phoneNumber = "";
  public password = "";
  public text = "";
  public customLable = "";
  public basicUsage = "";
  public userPassword = "";
  public readonly = "Readonly";
  public disabled = "disabled";
  public clear = "clear icon";
  public textarea = "";
  public encryptedValue = "3252523523523";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  background: #f7f8fa;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
ul li {
  margin: 20px 0;
}
ul li span.title {
  height: 52px;
  display: inline-block;
  line-height: 52px;
  color:  rgba(69, 90, 100, 0.6);
  text-indent: 1rem;
}
i.hidden-value {
  color: red;
}
.custom-label{
  display: inline-block;
  height: 40px;
  border-bottom: 1px solid #eee;
  width: 100%;
}
</style>
