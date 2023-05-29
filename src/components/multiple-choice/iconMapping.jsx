import Basketball from '../../assets/multiple-choice/sports/basketball.jpg'
import BasketballHoop from '../../assets/multiple-choice/sports/basketballHoop.jpeg'
import Soccerball from '../../assets/multiple-choice/sports/soccerball.png'
import SoccerNet from '../../assets/multiple-choice/sports/soccerNet.png'
import Football from '../../assets/multiple-choice/sports/football.jpeg'
import Goalpost from '../../assets/multiple-choice/sports/goalPost.png'

import Dog from '../../assets/multiple-choice/nature/dog.jpeg'
import Bone from '../../assets/multiple-choice/nature/bone.jpeg'
import Cat from '../../assets/multiple-choice/nature/cat.jpeg'
import Bowl from '../../assets/multiple-choice/nature/bowl.png'
import Bird from '../../assets/multiple-choice/nature/bird.jpeg'
import Nest from '../../assets/multiple-choice/nature/nest.jpeg'

import Egg from '../../assets/multiple-choice/food/egg.jpeg'
import EggCarton from '../../assets/multiple-choice/food/eggCarton.png'
import Milk from '../../assets/multiple-choice/food/milk.png'
import ShoppingCart from '../../assets/multiple-choice/food/shoppingCart.jpeg'
import Pie from '../../assets/multiple-choice/food/pie.png'
import Oven from '../../assets/multiple-choice/food/oven.jpeg'

import Car from '../../assets/multiple-choice/transportation/car.avif'
import Home from '../../assets/multiple-choice/transportation/home.jpeg'
import Rocket from '../../assets/multiple-choice/transportation/rocket.jpeg'
import Moon from '../../assets/multiple-choice/transportation/moon.jpeg'
import Train from '../../assets/multiple-choice/transportation/train.avif'
import Station from '../../assets/multiple-choice/transportation/station.avif'

const mapping = {
  sports: {
    MULTIPLECHOICE: {
      item: Basketball,
      target: BasketballHoop
    },
    MULTIPLESELECT: {
      item: Soccerball,
      target: SoccerNet
    },
    SCALEMULTIPLECHOICE: {
      item: Football,
      target: Goalpost
    }
  },
  nature: {
    MULTIPLECHOICE: {
      item: Dog,
      target: Bone
    },
    MULTIPLESELECT: {
      item: Cat,
      target: Bowl
    },
    SCALEMULTIPLECHOICE: {
      item: Bird,
      target: Nest
    }
  },
  transportation: {
    MULTIPLECHOICE: {
      item: Car,
      target: Home
    },
    MULTIPLESELECT: {
      item: Train,
      target: Station
    },
    SCALEMULTIPLECHOICE: {
      item: Rocket,
      target: Moon
    }
  },
  food: {
    MULTIPLECHOICE: {
      item: Pie,
      target: Oven
    },
    MULTIPLESELECT: {
      item: Egg,
      target: EggCarton
    },
    SCALEMULTIPLECHOICE: {
      item: Milk,
      target: ShoppingCart
    }
  }
}

export default mapping
