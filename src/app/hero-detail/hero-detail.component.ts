import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { Location } from '@angular/common';
import { Hero } from '../heroes/hero';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  hero;
  // heroes;
  currentId;
  constructor(private activateRoute: ActivatedRoute, private heroService: HeroService,
    private location: Location) { }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe((params)=>{

      this.currentId = +params.get("id");
      console.log(this.currentId);
      this.heroService.getHeroes().subscribe((heroes)=>{
        // console.log(heroes);
        // this.heroes = heroes;
        this.hero = heroes.find((hero)=>{
          return hero.id === this.currentId;
        });
        console.log(this.hero);
        // console.log(this.currentId);
      });
    
    });
  }

  

  onSave(){
    this.heroService.updateHero(this.hero)
      .subscribe(()=> this.goBack());
  }

  goBack(){
    this.location.back();
  }

}
