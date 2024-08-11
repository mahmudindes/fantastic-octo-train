<?php

namespace App\Repository;

use App\Entity\ComicTitle;
use App\Model\OrderByDto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ComicTitle>
 */
class ComicTitleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ComicTitle::class);
    }

    public function findByCustom(
        array $criteria,
        ?array $orderBy = null, ?int $limit = null, ?int $offset = null
    ): array
    {
        $query = $this->createQueryBuilder('c')
            ->leftJoin('c.language', 'cl')->addSelect('cl')
        ;

        $q1 = false;
        $q1Func = function(bool &$c, QueryBuilder &$q): void {
            if ($c) return;
            $q->leftJoin('c.comic', 'cc');
            $c = true;
        };

        $c1 = [];
        foreach ($criteria as $key => $val) {
            switch ($key) {
                case 'comicCodes':
                    \array_push($c1, ...$val);
                    break;
            }
        }
        if ($c1) {
            $q1Func($q1, $query);
            if (count($c1) == 1) {
                $query->andWhere('cc.code = :c1');
                $query->setParameter('c1', $c1[0]);
            } else {
                $query->andWhere('cc.code IN :c1');
                $query->setParameter('c1', $c1);
            };
        }

        if ($orderBy) {
            $orderBys = [];

            foreach ($orderBy as $val) {
                \array_push($orderBys, OrderByDto::parse($val));
            }

            foreach ($orderBys as $val) {
                switch ($val->name) {
                    case 'comicCode':
                        $q1Func($q1, $query);
                        $val->name = 'cc.code';
                        break;
                    case 'languageIETF':
                        $val->name = 'cl.ietf';
                        break;
                    case 'createdAt':
                    case 'updatedAt':
                    case 'ulid':
                    case 'title':
                    case 'synonym':
                    case 'romanized':
                        $val->name = 'l.' . $val->name;
                        break;
                    default:
                        continue 2;
                }

                switch (\strtolower($val->order ?? '')) {
                    case 'a':
                    case 'asc':
                    case 'ascending':
                        $val->order = 'ASC';
                        break;
                    case 'd':
                    case 'desc':
                    case 'descending':
                        $val->order = 'DESC';
                        break;
                    default:
                        $val->order = null;
                }

                if ($val->nulls) {
                    switch (\strtolower($val->nulls ?? '')) {
                        case 'f':
                        case 'first':
                            $val->nulls = 'DESC';
                            break;
                        case 'l':
                        case 'last':
                            $val->nulls = 'ASC';
                            break;
                        default:
                            $val->nulls = null;
                    }

                    $vname = \str_replace('.', '', $val->name);
                    $vselc = '(CASE WHEN ' . $val->name . ' IS NULL THEN 1 ELSE 0 END) AS HIDDEN ' . $vname;

                    $query->addSelect($vselc);
                    $query->addOrderBy($vname, $val->nulls);
                }

                $query->addOrderBy($val->name, $val->order);
            }
        } else {
            $query->orderBy('c.ulid');
        }

        $query->setMaxResults($limit);
        $query->setFirstResult($offset);

        return $query->getQuery()->getResult();
    }

    public function countCustom(array $criteria = []): int
    {
        $query = $this->createQueryBuilder('c')
            ->select('count(c.id)')
        ;

        $q1 = false;
        $q1Func = function(bool &$c, QueryBuilder &$q): void {
            if ($c) return;
            $q->leftJoin('c.comic', 'cc');
            $c = true;
        };

        $c1 = [];
        foreach ($criteria as $key => $val) {
            switch ($key) {
                case 'comicCodes':
                    \array_push($c1, ...$val);
                    break;
            }
        }
        if ($c1) {
            $q1Func($q1, $query);
            if (count($c1) == 1) {
                $query->andWhere('cc.code = :c1');
                $query->setParameter('c1', $c1[0]);
            } else {
                $query->andWhere('cc.code IN :c1');
                $query->setParameter('c1', $c1);
            };
        }

        return $query->getQuery()->getSingleScalarResult();
    }
}
