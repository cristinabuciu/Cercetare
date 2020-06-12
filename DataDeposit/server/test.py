import es_connector
import pprint


es = es_connector.ESClass(server='172.24.0.2', port=9200, use_ssl=False, user='', password='')
es.connect()

# es.insert('sergiu', '_doc', {'hatz':'hatz'})
pprint.pprint(es.get_es_index('datasets'))
print("yeye")

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 1,
        'input': {'article_title': 'Letting Go',
                'authors': ['Atul Gawande', 'Atul Doiwande', 'Atul Treiwande'],
                'country': 'Romania',
                'data_format': 'zip',
                'dataset_title': 'Letting Go Dataset',
                'domain': 'MEDICINE',
                'gitlink': 'www.ex.com',
                'private': True,
                'short_desc': 'What should medicine do when it can’t save your life?',
                'subdomain': ['MEDICINE_3'],
                'year': '2020',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.22,
                'ratings_number': 25,
                'owner': 'admin'
                }
            }

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 2,
        'input': {'article_title': 'The Real Heroes Are Dead',
                'authors': ['James B. Stewart', 'James B. Stewart Doiwande', 'James B. Stewart Treiwande'],
                'country': 'Romania',
                'data_format': 'zip',
                'dataset_title': 'The Real Heroes Are Dead Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'A 9/11 hero and the loved ones he left behind.',
                'subdomain': ['IT_2'],
                'year': '2020',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 4.22,
                'ratings_number': 28,
                'owner': 'admin'
                }
            }

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 3,
        'input': {'article_title': 'The Dirty Trickster',
                'authors': [' Jeffrey Toobin', ' Jeffrey Tuube'],
                'country': 'Japonia',
                'data_format': 'zip',
                'dataset_title': 'The Dirty Trickster Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Campaign tips from Roger Stone.',
                'subdomain': ['IT_3'],
                'year': '2020',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 1.22,
                'ratings_number': 25,
                'owner': 'admin'
                }
            }

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 4,
        'input': {'article_title': 'Nora Ephron’s Apartment: A Love Story',
                'authors': ['Nora Ephron', 'Nora Iepuran'],
                'country': 'Japonia',
                'data_format': 'zip',
                'dataset_title': 'Nora Ephron’s Apartment: A Love Story Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'To move into the Apthorp was to enter a state of giddy, rent-stabilized delirium.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2019',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.22,
                'ratings_number': 525,
                'owner': 'admin'
                }
            }

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 5,
        'input': {'article_title': 'Trial by Fire',
                'authors': ['David Grann', 'David GrannPapan'],
                'country': 'China',
                'data_format': 'zip',
                'dataset_title': 'Trial by Fire Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Cameron Todd Willingham insisted upon his innocence in the deaths of his children and refused to plead guilty in return for a life sentence. Did Texas execute an innocent man?',
                'subdomain': ['IT_3'],
                'year': '2018',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 5.00,
                'ratings_number': 325,
                'owner': 'Dorian'
                }
            }

  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 6,
        'input': {'article_title': 'The Lottery',
                'authors': ['Shirley Jackson', 'Michael Jackson', 'O\'shea Jackson'],
                'country': 'Canada',
                'data_format': 'zip',
                'dataset_title': 'The Lottery Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Fiction: The residents of a small American town gather in the square for an annual summer ritual.',
                'subdomain': ['IT_3'],
                'year': '2014',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 2.00,
                'ratings_number': 125,
                'owner': 'Dorian'
                }
            }
  {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 7,
        'input': {'article_title': 'Hiroshima',
                'authors': ['John Hersey', 'John Le\'boom', 'Adrien Noir'],
                'country': 'Canada',
                'data_format': 'zip',
                'dataset_title': 'Hiroshima Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'A groundbreaking report on how six survivors experienced the atomic bomb and its aftermath.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2014',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 2.00,
                'ratings_number': 825,
                'owner': 'admin'
                }
            }
    
      {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 8,
        'input': {'article_title': 'Brokeback Mountain',
                'authors': ['Annie Proulx', 'Annie Prologe', 'Annie Epilog'],
                'country': 'Romania',
                'data_format': 'zip',
                'dataset_title': 'Brokeback Mountain Dataset',
                'domain': 'BIOLOGY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Fiction: The tragic love story of two Wyoming cowboys.',
                'subdomain': ['BIOLOGY_3'],
                'year': '2014',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 2.00,
                'ratings_number': 225,
                'owner': 'admin'
                }
            }

        
      {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 9,
        'input': {'article_title': 'The Warp engine',
                'authors': ['Jean-Luc Picard', 'Geordi LaForge', 'William T. Riker'],
                'country': 'France',
                'data_format': 'zip',
                'dataset_title': 'The Warp engine Dataset',
                'domain': 'PHYSICS',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Fiction: Federation first warp drive.',
                'subdomain': ['PHYSICS_2'],
                'year': '2014',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 4.00,
                'ratings_number': 253,
                'owner': 'admin'
                }
            }
    
 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 10,
        'input': {'article_title': 'The Hunted',
                'authors': ['Jeffrey Goldberg', 'Jeffrey Tube'],
                'country': 'Romania',
                'data_format': 'zip',
                'dataset_title': 'The Hunted Dataset',
                'domain': 'PHYSICS',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Did American conservationists in Africa go too far?',
                'subdomain': ['PHYSICS_2'],
                'year': '2014',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 4.05,
                'ratings_number': 258,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 11,
        'input': {'article_title': 'The Perils of Pearl and Olga',
                'authors': ['St. Clair McKelway', 'St. Josh La'],
                'country': 'Russia',
                'data_format': 'zip',
                'dataset_title': 'The Perils of Pearl and Olga Dataset',
                'domain': 'BIOLOGY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'They were complete strangers—until they were drawn into an ex-husband’s terrifying plot.',
                'subdomain': ['BIOLOGY_1'],
                'year': '1999',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 2.00,
                'ratings_number': 2455,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 12,
        'input': {'article_title': 'Paths of Glory',
                'authors': ['Ian Parker', 'Peter Parker', 'Spiderman'],
                'country': 'Russia',
                'data_format': 'zip',
                'dataset_title': 'Paths of Glory Dataset',
                'domain': 'BIOLOGY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Rory Stewart walked across Afghanistan. Can he make it to 10 Downing Street?',
                'subdomain': ['BIOLOGY_1'],
                'year': '2002',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.50,
                'ratings_number': 25425,
                'owner': 'SpiderParker'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 13,
        'input': {'article_title': 'Glory to the soviet union',
                'authors': ['Vladimir Putin'],
                'country': 'Russia',
                'data_format': 'zip',
                'dataset_title': 'Paths of Glory Dataset',
                'domain': 'BUSINESS',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Heil',
                'subdomain': ['BUSINESS_3'],
                'year': '2000',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 5.00,
                'ratings_number': 2455,
                'owner': 'Putin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 14,
        'input': {'article_title': 'The Old Man and the Gun',
                'authors': ['David Grann'],
                'country': 'Russia',
                'data_format': 'zip',
                'dataset_title': 'The Old Man and the Gun Dataset',
                'domain': 'BUSINESS',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Forrest Tucker had a long career robbing banks, and he wasn’t willing to retire.',
                'subdomain': ['BUSINESS_3'],
                'year': '2005',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 4.00,
                'ratings_number': 215,
                'owner': 'Putin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 15,
        'input': {'article_title': 'Letter from a Region in My Mind',
                'authors': ['James Baldwin', 'James Bond'],
                'country': 'Canada',
                'data_format': 'zip',
                'dataset_title': 'Letter from a Region in My Mind Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Reflections on the state of civil rights in America.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2015',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.00,
                'ratings_number': 2526,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 16,
        'input': {'article_title': 'Secrets of the Magus',
                'authors': ['Mark Singer', 'Jaina Proudmore'],
                'country': 'Mexic',
                'data_format': 'zip',
                'dataset_title': 'Secrets of the Magus Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Ricky Jay does closeup magic that flouts reality. But, rather than headline in Las Vegas, he prefers to live in the mysterious world of ancient mountebanks and eccentric entertainers.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2015',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.00,
                'ratings_number': 24255,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 17,
        'input': {'article_title': 'Ghosts in the House',
                'authors': ['Hilton Als', 'Hilton Paris'],
                'country': 'Mexic',
                'data_format': 'zip',
                'dataset_title': 'Ghosts in the House, Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'How Toni Morrison fostered a generation of writers.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2008',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 4.90,
                'ratings_number': 255,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 18,
        'input': {'article_title': 'Small Change',
                'authors': ['Malcolm Gladwell', 'Malcolm Reed', 'Malcolm Merlin'],
                'country': 'Canada',
                'data_format': 'zip',
                'dataset_title': 'Small Change Dataset',
                'domain': 'CHEMISTRY',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'Why the revolution will not be tweeted.',
                'subdomain': ['CHEMISTRY_1'],
                'year': '2004',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 1.90,
                'ratings_number': 89,
                'owner': 'Josh'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 19,
        'input': {'article_title': 'On Impact',
                'authors': ['Stephen King', 'Stephen McBugy', 'Arnold C'],
                'country': 'Canada',
                'data_format': 'zip',
                'dataset_title': 'On Impact Dataset',
                'domain': 'BIOLOGY',
                'gitlink': 'www.ex.com',
                'private': True,
                'short_desc': 'After an accident, the novelist had to learn to write again.',
                'subdomain': ['BIOLOGY_3'],
                'year': '2003',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 1.90,
                'ratings_number': 96,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 20,
        'input': {'article_title': 'Man of Extremes',
                'authors': ['Dana Goodyear', 'Dana Badyear', 'Dana Mehyear'],
                'country': 'Romania',
                'data_format': 'zip',
                'dataset_title': 'Man of Extremes Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': True,
                'short_desc': 'The return of James Cameron.',
                'subdomain': ['IT_4'],
                'year': '2008',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.90,
                'ratings_number': 74,
                'owner': 'admin'
                }
            }

 {'date': '2020-06-12T11:49:45+0000',
        'geo_coord': '45.9432, 24.9668',
        'id': 21,
        'input': {'article_title': 'The Fourth State of Matter',
                'authors': ['Ann Beard', 'Ann NoBeard', 'Ann BlackBeard'],
                'country': 'Japan',
                'data_format': 'zip',
                'dataset_title': 'The Fourth State of Matter Dataset',
                'domain': 'IT',
                'gitlink': 'www.ex.com',
                'private': False,
                'short_desc': 'A week in the author\'s life when it became impossible to control the course of events.',
                'subdomain': ['IT_4'],
                'year': '2017',
                'full_desc': 'hgnviusejrhscgmrhnvkgmiutrm',
                'avg_rating_value': 3.29,
                'ratings_number': 285,
                'owner': 'admin'
                }
            }