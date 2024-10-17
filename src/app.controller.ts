import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, response } from 'express';
import { parse } from 'path';
import { min } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  @Get('form')
  @Render('adatMegadas')
  getForm() {
    return {
      errors: [],
      data : []
    }
  }

  @Post('form')
  getFormPost(@Body() foglalasDto : FoglalasDto, @Res() res:Response) {
    let errors = [];
    let data = foglalasDto;
    if (!foglalasDto.nev) {
      errors.push("Kötelező nevet megadni!")
    }    

    if (!foglalasDto.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Nem megfelelő az e-mail formátuma!")
    }
   

    const date = new Date();

    const year = date.getFullYear();
    const months = date.getMonth()+1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const dateAndTime  = foglalasDto.date.split('T');
    const yearMonthDay = dateAndTime[0].split('-');
    const hoursAndMinutes = dateAndTime[1].split(':');
    
    if(parseInt(yearMonthDay[0])<=year) {
      if(parseInt(yearMonthDay[1])<=months) {
        if (parseInt(yearMonthDay[2])<=day) {
          if(parseInt(hoursAndMinutes[0])<=hours) {
            if (parseInt(hoursAndMinutes[1])<minutes) {
              errors.push("Az időpont nem lehet régebbi a jelenleginél!")
            }
          }
        }
      }
    }

    if (!foglalasDto.nezok || foglalasDto.nezok<1 || foglalasDto.nezok>10) {
      errors.push("A nézők mező kötelező - érteke minimum 1, maximum 10!")
    }

    if (errors.length > 0) {
      res.render('adatMegadas', {errors, data})
      return
    }
  res.redirect(303, '/sikeres')
  }

  

  @Get('sikeres')
  @Render('sikeres')
  getSikeres() {

  }
}


