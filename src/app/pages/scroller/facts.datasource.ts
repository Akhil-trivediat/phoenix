import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { FactService } from './fact.service';

export interface Fact {
    text?: string;
    date?: string;
}

export class FactsDataSource extends DataSource<Fact | undefined> {
    private cachedFacts = Array.from<Fact>({ length: 0 });
    private dataStream = new BehaviorSubject<(any | undefined)[]>(this.cachedFacts);
    private subscription = new Subscription();
    public total = 0;

    constructor(private factService: FactService) {
        super();

        // Start with some data.
        this._fetchFactPage();
    }

    connect(collectionViewer: CollectionViewer): Observable<(Fact | undefined)[] | ReadonlyArray<Fact | undefined>> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {

            const currentPage = this._getPageForIndex(range.end);
        
            if (currentPage > this.lastPage) {
              this.lastPage = currentPage;
              this._fetchFactPage();
            }
        
          }));
          return this.dataStream;
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subscription.unsubscribe();
    }

    private pageSize = 10;
    private lastPage = 0;

    private _fetchFactPage(): void {
        for (let i = 0; i < this.pageSize; ++i) {
            this.factService.getRandomFact().subscribe(res => {
                this.total++;
                this.cachedFacts = this.cachedFacts.concat(<Fact>{text: this.total.toString(), data: res});
                this.dataStream.next(this.cachedFacts);
            });
        }
    }

    private _getPageForIndex(i: number): number {
        return Math.floor(i / this.pageSize);
    }
}