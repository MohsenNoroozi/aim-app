<template>
  <div class="column fit">
    <div class="col-auto q-my-lg">
      <q-img alt="AIM" fit="scale-down" height="128px" src="images/default_logo.png"/>
    </div>

    <div class="col column justify-center">
      <q-form class="full-width q-mb-lg q-px-md" @submit="onSubmit">
        <div class="q-mb-lg q-px-md">
          <div class="text-h4 text-white text-bold text-center">Welcome to AIM</div>
        </div>
        <q-card bordered class="q-mx-auto bg-grey-1" flat style="max-width:480px">
          <q-card-section class="q-mb-xl">
            <q-input
              ref="assessmentInput"
              v-model="assessmentUUID"
              autofocus
              autocomplete="off"
              bg-color="white"
              bottom-slots
              filled
              hint="If you have an Assessment ID (a unique code usually shared with you), please enter it here to begin your assessment."
              label="Assessment ID"
              name="assessment_uuid"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn color="primary" tabindex="-1" type="submit" :disable="!assessmentUUID">
              <q-icon name="play_arrow" left />
              <div style="width:164px">Start Assessment</div>
            </q-btn>
          </q-card-actions>
        </q-card>
        <div class="text-center text-grey q-my-lg">
          <div class="text-caption">
            <a class="text-blue-3 no-decoration" href="#">About Us</a> &nbsp;•&nbsp;
            <a class="text-blue-3 no-decoration" href="#">Terms & Conditions</a> &nbsp;•&nbsp;
            <a class="text-blue-3 no-decoration" href="#">Contact</a>
          </div>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue"
import {useQuasar} from "quasar"
import {useRouter} from "vue-router"
import {api} from "boot/xhr.js"

const $q = useQuasar()
const router = useRouter()
const assessmentUUID = ref('')
const assessmentInput = ref(null)

const onSubmit = () => {
  if (!assessmentUUID.value) return

  api()
    .get(`/assessments/${assessmentUUID.value}/check`)
    .then(r => {
      if (r.data.exists) {
        router.push({name: 'Branch', params: {code: assessmentUUID.value}})
      } else {
        $q.notify({type: 'negative', message: 'The assessment ID you entered is not recognized.'})
        assessmentUUID.value = ''
        assessmentInput.value.focus()
      }
    })
}
</script>

<style lang="scss" scoped>
:deep(input::placeholder) {
  opacity: 0.4;
}

a:hover {
  color: white !important;
}
</style>
