<template>
  <div class="field-view">
    <div id="container">
      <ul>
        <li>
          <span class="title">Basic usage</span>
          <v-field label="Label" v-model="basicUsage" placeholder="Text"></v-field>
        </li>
        <li>
          <span class="title">Types</span>
          <v-field
            v-model="phoneNumber"
            label="Phone"
            type="tel"
            min="3"
            max="10"
            placeholder="phone number"
            pattern="[0-9]*"
          ></v-field>
          <v-field
            v-model="password"
            label="Password"
            type="password"
            placeholder="password"
          ></v-field>
          <v-field
            v-model="text"
            label="Text"
            type="text"
            placeholder="text"
          ></v-field>
        </li>
        <li>
          <span class="title">Readonly</span>
          <v-field
            v-model="readonly"
            label="ID"
            type="text"
            readonly
          ></v-field>
        </li>
        <li>
          <span class="title">
            Encrypted
            <i class="hidden-value">{{encryptedValue}}</i>
          </span>
          <v-field
            v-model="encryptedValue"
            label="Encrypted"
            type="text"
            :encrypted="true"
            ref="encrypted"
          ></v-field>
        </li>
        <li>
          <span class="title">Disabled</span>
          <v-field
            v-model="disabled"
            label="Keyword"
            type="text"
            :disabled="true"
          ></v-field>
        </li>
        <li>
          <span class="title">Clear Icon</span>
          <v-field
            class="clear-icon"
            v-model="clear"
            label="Clear"
            type="text"
            :clearable="true"
          ></v-field>
        </li>
        <li>
          <span class="title">Textarea</span>
          <v-field
            v-model="textarea"
            label="Textarea"
            type="textarea"
            maxlength="50"
            :showTextareaCounter="true"
            :clearable="true"
          ></v-field>
        </li>
        <li>
          <span class="title">Column display</span>
          <v-field v-model="customLable" display="column" placeholder="上面的label是我的">
            <template #label>
              <span class="custom-label">Column display</span>
            </template>
          </v-field>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
// import Queen from "../../src/component/Queen";
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
