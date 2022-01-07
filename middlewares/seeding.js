module.exports.braandlySeeder = (data, model) => {
const seeds = []
Object.keys(data).map(indData => {
  seeds.push(new model(data[indData]))
})
seeds.forEach(seed => {
  model.create(seed)
  .then(response => {
      console.log(response)
  })
  .catch(error => {
      console.log(error)
  })
})
}